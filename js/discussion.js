/**
 * KONSEY TARTIŞMA SİSTEMİ - TARTIŞMA AKIŞ KONTROLÜ
 * 4 aşamalı tartışma mekanizması ve hakem değerlendirmesi
 */

class DiscussionEngine {
    constructor() {
        this.currentPhase = 0;
        this.phases = [
            { id: 1, name: 'Kullanıcı Girdisi', status: 'pending' },
            { id: 2, name: 'İlk Görüşler', status: 'pending' },
            { id: 3, name: 'Çapraz Eleştiri', status: 'pending' },
            { id: 4, name: 'Revizyon', status: 'pending' },
            { id: 5, name: 'Hakem', status: 'pending' }
        ];
        this.userQuestion = '';
        this.agentResponses = {
            initial: {},
            critique: {},
            revision: {}
        };
        this.isRunning = false;
    }

    /**
     * Tartışmayı başlat
     */
    async start(question) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.userQuestion = question;
        this.reset();

        try {
            // Aşama 1: Kullanıcı Girdisi
            await this.executePhase1();

            // Aşama 2: İlk Görüşler
            await this.executePhase2();

            // Aşama 3: Çapraz Eleştiri
            await this.executePhase3();

            // Aşama 4: Revizyon
            await this.executePhase4();

            // Hakem Değerlendirmesi
            await this.executeArbiter();

            // Tartışmayı localStorage'a kaydet
            this.saveToHistory();

        } catch (error) {
            console.error('Tartışma hatası:', error);
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * AŞAMA 1: Kullanıcı Girdisi
     */
    async executePhase1() {
        this.setPhaseActive(1);

        const centerContent = document.getElementById('centerContent');
        centerContent.innerHTML = `
            <div class="user-question">
                <div class="user-question-header">
                    <span>👤</span>
                    <span>Kullanıcı Sorusu</span>
                </div>
                <div class="user-question-text">${this.escapeHtml(this.userQuestion)}</div>
            </div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;

        await this.delay(1500);
        this.setPhaseCompleted(1);
    }

    /**
     * AŞAMA 2: İlk Görüşler
     */
    async executePhase2() {
        this.setPhaseActive(2);

        // Typing indicator'ı kaldır
        this.removeTypingIndicator();

        const agents = AgentUtils.getAgentOrder();

        for (const agentId of agents) {
            const agent = AGENTS[agentId];

            // Paneli aktif yap
            this.setPanelSpeaking(agentId, true);

            // API'den yanıt al
            let response;
            try {
                if (agentId === 'claude') {
                    const result = await window.apiClient.getClaudeInitial(this.userQuestion);
                    response = result.response;
                } else if (agentId === 'gemini') {
                    const result = await window.apiClient.getGeminiInitial(this.userQuestion);
                    response = result.response;
                } else if (agentId === 'grok') {
                    const result = await window.apiClient.getGrokInitial(this.userQuestion);
                    response = result.response;
                }
            } catch (error) {
                console.warn(`${agentId} API hatası, fallback template kullanılıyor:`, error);
                // Fallback to template
                response = agent.templates.initial(this.userQuestion);
            }

            this.agentResponses.initial[agentId] = response;

            // Yanıtı göster (yazı efektiyle)
            await this.showAgentMessage(agentId, 'İLK GÖRÜŞ', response);

            // Paneli pasif yap
            this.setPanelSpeaking(agentId, false);

            await this.delay(800);
        }

        this.setPhaseCompleted(2);
    }

    /**
     * AŞAMA 3: Çapraz Eleştiri
     */
    async executePhase3() {
        this.setPhaseActive(3);

        const agents = AgentUtils.getAgentOrder();

        for (const agentId of agents) {
            const agent = AGENTS[agentId];
            const targetId = AgentUtils.getCritiqueTarget(agentId);
            const targetResponse = this.agentResponses.initial[targetId];

            this.setPanelSpeaking(agentId, true);

            // API'den eleştiri al
            let critique;
            try {
                if (agentId === 'claude') {
                    const result = await window.apiClient.getClaudeCritique(targetId, targetResponse);
                    critique = result.response;
                } else if (agentId === 'gemini') {
                    const result = await window.apiClient.getGeminiCritique(targetId, targetResponse);
                    critique = result.response;
                } else if (agentId === 'grok') {
                    const result = await window.apiClient.getGrokCritique(targetId, targetResponse);
                    critique = result.response;
                }
            } catch (error) {
                console.warn(`${agentId} API hatası, fallback template kullanılıyor:`, error);
                // Fallback to template
                critique = agent.templates.critique(targetId, targetResponse);
            }

            this.agentResponses.critique[agentId] = critique;

            await this.showAgentMessage(agentId, `ELEŞTİRİ → ${AGENTS[targetId].name}`, critique);

            this.setPanelSpeaking(agentId, false);

            await this.delay(800);
        }

        this.setPhaseCompleted(3);
    }

    /**
     * AŞAMA 4: Revizyon
     */
    async executePhase4() {
        this.setPhaseActive(4);

        const agents = AgentUtils.getAgentOrder();

        for (const agentId of agents) {
            const agent = AGENTS[agentId];
            
            // Her ajanı kritik yapan ajanı bul
            const criticId = this.findCritic(agentId);
            const criticism = this.agentResponses.critique[criticId] || 'Eleştiri alındı';

            this.setPanelSpeaking(agentId, true);

            // API'den revizyon al
            let revision;
            try {
                if (agentId === 'claude') {
                    const result = await window.apiClient.getClaudeRevision(criticism);
                    revision = result.response;
                } else if (agentId === 'gemini') {
                    const result = await window.apiClient.getGeminiRevision(criticism);
                    revision = result.response;
                } else if (agentId === 'grok') {
                    const result = await window.apiClient.getGrokRevision(criticism);
                    revision = result.response;
                }
            } catch (error) {
                console.warn(`${agentId} API hatası, fallback template kullanılıyor:`, error);
                // Fallback to template
                revision = agent.templates.revision(criticism);
            }

            this.agentResponses.revision[agentId] = revision;

            await this.showAgentMessage(agentId, 'REVİZYON', revision);

            this.setPanelSpeaking(agentId, false);

            await this.delay(800);
        }

        this.setPhaseCompleted(4);
    }

    /**
     * Belirli bir ajanı kritik yapan ajanı bul
     */
    findCritic(targetAgentId) {
        // Çoğul critique hedefleri
        const critiquePairs = {
            'claude': 'grok',
            'gemini': 'claude',
            'grok': 'gemini'
        };
        return critiquePairs[targetAgentId] || 'claude';
    }

    /**
     * HAKEM DEĞERLENDİRMESİ
     */
    async executeArbiter() {
        this.setPhaseActive(5);

        const centerContent = document.getElementById('centerContent');

        // Mevcut içeriğe hakem değerlendirmesi ekle
        const evaluation = this.generateArbiterEvaluation();

        centerContent.innerHTML += `
            <div class="arbiter-evaluation">
                <div class="arbiter-header">
                    <span style="font-size: 1.5rem;" aria-hidden="true">⚖️</span>
                    <h4>MERKEZ DEĞERLENDİRME</h4>
                </div>
                <div class="arbiter-content">
                    ${evaluation}
                </div>
            </div>
        `;

        // Sonuç özeti oluştur
        this.generateResultsSummary();

        // Scroll to arbiter
        centerContent.scrollTop = centerContent.scrollHeight;

        this.setPhaseCompleted(5);
    }

    /**
     * Sonuç özeti oluştur
     */
    generateResultsSummary() {
        const summaryContent = document.getElementById('summaryContent');
        if (!summaryContent) return;

        const claudeResponse = this.agentResponses.initial['claude'] || 'Yanıt yok';
        const geminiResponse = this.agentResponses.initial['gemini'] || 'Yanıt yok';
        const grokResponse = this.agentResponses.initial['grok'] || 'Yanıt yok';

        const summary = `
TARTIŞMA ÖZETI
==============

KONU: ${this.escapeHtml(this.userQuestion)}

---

CLAUDE'UN GÖRÜŞÜ (Metodolog):
${this.truncateText(claudeResponse, 300)}

GEMINI'NİN GÖRÜŞÜ (Sentetik Zihin):
${this.truncateText(geminiResponse, 300)}

GROK'UN GÖRÜŞÜ (Muhalif):
${this.truncateText(grokResponse, 300)}

---

SONUÇ:
Bu tartışma, konuya dair farklı bakış açılarını sistemli bir şekilde sunmuştur.
Her ajan kendi perspektifini ortaya koyarak, toplam epistemik kaliteyi artırmıştır.

Tartışma Tarihi: ${new Date().toLocaleString('tr-TR')}
        `;

        summaryContent.textContent = summary;
    }

    /**
     * Metni kısalt
     */
    truncateText(text, maxLength = 300) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Hakem değerlendirmesi oluştur
     */
    generateArbiterEvaluation() {
        return `
            <h5>📍 Ortak Noktalar</h5>
            <ul>
                <li>Tüm perspektifler, konunun karmaşıklığını kabul ediyor</li>
                <li>Varsayımların sorgulanması gerektiği konusunda uzlaşı var</li>
                <li>Tek bir "doğru" cevabın olmayabileceği kabul ediliyor</li>
            </ul>
            
            <h5>⚡ Çözümsüz Kalan Anlaşmazlıklar</h5>
            <ul>
                <li><strong>Metodoloji vs. Esneklik:</strong> Sistematik yaklaşım mı, yoksa durumsal uyum mu öncelikli olmalı?</li>
                <li><strong>Şüphecilik Sınırı:</strong> Sorgulamanın nerede durması gerektiği belirsiz</li>
            </ul>
            
            <h5>🔗 En Sağlam Argüman Zincirleri</h5>
            <ul>
                <li>Eleştirel düşüncenin yapıcı alternatiflerle desteklenmesi gerektiği görüşü</li>
                <li>Farklı bakış açılarının sentezinin, tek başına hiçbirinden güçlü olduğu</li>
            </ul>
            
            <h5>📌 Sonuç</h5>
            <p>Bu tartışma, konuya dair tek bir "doğru" üretmekten ziyade, 
            düşünce çatışması yoluyla epistemik kaliteyi artırmayı hedefledi. 
            Sunulan perspektifler birbirini tamamlayıcı nitelikte olup, 
            kullanıcıya şeffaf ve izlenebilir bir düşünme süreci sunmaktadır.</p>
        `;
    }

    /**
     * Ajan mesajını göster
     */
    async showAgentMessage(agentId, phase, content) {
        const agent = AGENTS[agentId];
        const contentElement = document.getElementById(agent.contentId);

        // İlk mesajsa empty state'i kaldır
        const emptyState = contentElement.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${agentId}`;
        messageDiv.innerHTML = `
            <div class="message-phase">${phase}</div>
            <div class="message-content">
                ${this.formatContent(content)}
            </div>
        `;

        contentElement.appendChild(messageDiv);

        // Scroll to new message
        contentElement.scrollTop = contentElement.scrollHeight;

        // Yazı animasyonu efekti için bekle
        await this.delay(1200);
    }

    /**
     * İçeriği formatla
     */
    formatContent(text) {
        return this.escapeHtml(text || '')
            .trim()
            .replace(/\n\s+/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .split('\n\n')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    /**
     * Paneli konuşuyor olarak işaretle
     */
    setPanelSpeaking(agentId, isSpeaking) {
        const panel = document.getElementById(AGENTS[agentId].panelId);
        if (isSpeaking) {
            panel.classList.add('speaking');
        } else {
            panel.classList.remove('speaking');
        }
    }

    /**
     * Aşamayı aktif yap
     */
    setPhaseActive(phaseNumber) {
        const phaseElement = document.getElementById(`phase${phaseNumber}`);
        if (phaseElement) {
            phaseElement.classList.add('active');
            phaseElement.classList.remove('completed');
        }
        this.currentPhase = phaseNumber;
    }

    /**
     * Aşamayı tamamlandı olarak işaretle
     */
    setPhaseCompleted(phaseNumber) {
        const phaseElement = document.getElementById(`phase${phaseNumber}`);
        if (phaseElement) {
            phaseElement.classList.remove('active');
            phaseElement.classList.add('completed');
        }
    }

    /**
     * Typing indicator'ı kaldır
     */
    removeTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Sistemi sıfırla
     */
    reset() {
        this.currentPhase = 0;
        this.agentResponses = { initial: {}, critique: {}, revision: {} };

        // Panelleri temizle
        ['claude', 'gemini', 'grok'].forEach(agentId => {
            const content = document.getElementById(AGENTS[agentId].contentId);
            const agent = AGENTS[agentId];
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${agentId === 'claude' ? '🔬' : agentId === 'gemini' ? '✨' : '🔥'}</div>
                    <p>Yanıt bekleniyor...</p>
                </div>
            `;
        });

        // Merkez paneli temizle
        document.getElementById('centerContent').innerHTML = '';

        // Aşamaları sıfırla
        for (let i = 1; i <= 5; i++) {
            const phaseElement = document.getElementById(`phase${i}`);
            if (phaseElement) {
                phaseElement.classList.remove('active', 'completed');
            }
        }
    }

    /**
     * HTML karakterlerini escape et
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Bekleme fonksiyonu
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Tartışmayı localStorage'a kaydet
     */
    saveToHistory() {
        try {
            const discussion = {
                claudeInitial: document.getElementById('claudeContent').innerText || '',
                geminiInitial: document.getElementById('geminiContent').innerText || '',
                grokInitial: document.getElementById('grokContent').innerText || ''
            };
            
            if (window.saveDiscussionToHistory) {
                window.saveDiscussionToHistory(this.userQuestion, discussion);
            }
        } catch (error) {
            console.error('Tartışma kaydetme hatası:', error);
        }
    }
}

// Global erişim için
window.DiscussionEngine = DiscussionEngine;
