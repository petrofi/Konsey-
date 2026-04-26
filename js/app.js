/**
 * KONSEY TARTIŞMA SİSTEMİ - ANA UYGULAMA
 * Başlatma, kullanıcı etkileşimi, hata yönetimi ve olay işleme
 */

// Tartışma motoru instance'ı
let discussionEngine = null;

/**
 * Sayfa yüklendiğinde çalışır
 */
document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

/**
 * Uygulamayı başlat
 */
function initialize() {
    discussionEngine = new DiscussionEngine();

    // Input alanına enter tuşu desteği
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            startDiscussion();
        }
    });

    // Placeholder animasyonu
    animatePlaceholder();

    // Error handling setup
    window.addEventListener('error', (event) => {
        console.error('Uygulama Hatası:', event.error);
        showError('Bir hata oluştu. Lütfen sayfayı yenileyin.');
    });

    console.log('🏛️ Konsey Tartışma Sistemi başlatıldı');
}

/**
 * Tartışmayı başlat
 */
function startDiscussion() {
    const userInput = document.getElementById('userInput');
    const startBtn = document.getElementById('startBtn');
    const question = userInput.value.trim();

    if (!question) {
        shakeInput();
        showError('Lütfen tartışılacak bir konu giriniz');
        return;
    }

    if (question.length < 5) {
        shakeInput();
        showError('Soru en az 5 karakter olmalıdır');
        return;
    }

    if (discussionEngine.isRunning) {
        return;
    }

    // Sonuç özeti panelini gizle
    const resultsSummary = document.getElementById('resultsSummary');
    if (resultsSummary) {
        resultsSummary.classList.add('hidden');
    }

    // Butonu devre dışı bırak
    startBtn.disabled = true;
    userInput.disabled = true;
    startBtn.innerHTML = '⏳ Tartışma Devam Ediyor...';

    // Tartışmayı başlat
    discussionEngine.start(question).then(() => {
        // Tartışma bitti
        startBtn.disabled = false;
        userInput.disabled = false;
        startBtn.innerHTML = '🔄 Yeni Tartışma Başlat';
        
        // Sonuç özeti panelini göster
        setTimeout(() => {
            showResultsSummary();
        }, 500);
    }).catch((error) => {
        console.error('Tartışma hatası:', error);
        startBtn.disabled = false;
        userInput.disabled = false;
        startBtn.innerHTML = '🚀 Tartışmayı Başlat';
        showError('Tartışma başlatılırken bir hata oluştu');
    });
}

/**
 * Input alanını salla (hata durumunda)
 */
function shakeInput() {
    const inputContainer = document.querySelector('.input-container');
    inputContainer.style.animation = 'none';
    
    setTimeout(() => {
        inputContainer.style.animation = 'shake 0.5s ease';
    }, 10);

    setTimeout(() => {
        inputContainer.style.animation = '';
    }, 510);

    // Shake animasyonu ekle
    if (!document.getElementById('shakeStyle')) {
        const style = document.createElement('style');
        style.id = 'shakeStyle';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                50% { transform: translateX(10px); }
                75% { transform: translateX(-10px); }
            }
            
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                box-shadow: 0 12px 40px rgba(239, 68, 68, 0.3);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .error-message button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Placeholder animasyonu
 */
function animatePlaceholder() {
    const placeholders = [
        'Yapay zekanın geleceği hakkında ne düşünüyorsunuz?',
        'Özgür irade var mıdır?',
        'İklim değişikliğiyle nasıl mücadele edilmeli?',
        'Evrensel temel gelir uygulanmalı mı?',
        'Eğitim sistemi nasıl dönüştürülmeli?',
        'Sosyal medya toplumu nasıl etkiliyor?',
        'Demokrasinin geleceği nasıl şekillenecek?',
        'Yapay zeka etik mi?',
        'Bilim ve sanat arasında bağlantı var mı?'
    ];

    const userInput = document.getElementById('userInput');
    let currentIndex = 0;

    setInterval(() => {
        if (document.activeElement !== userInput && userInput.value === '') {
            currentIndex = (currentIndex + 1) % placeholders.length;
            userInput.placeholder = placeholders[currentIndex];
        }
    }, 5000);
}

/**
 * Panel hover efektleri için ek animasyon
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            if (!panel.classList.contains('speaking')) {
                panel.style.transform = 'translateY(-6px)';
            }
        });

        panel.addEventListener('mouseleave', () => {
            if (!panel.classList.contains('speaking')) {
                panel.style.transform = '';
            }
        });
    });
});

/**
 * Input alanını temizle (ekrandan silinir, veri kaydedilir)
 */
function clearInput() {
    const userInput = document.getElementById('userInput');
    userInput.value = '';
    userInput.focus();
}

/**
 * Tartışmayı localStorage'a kaydet
 */
function saveDiscussionToHistory(question, discussion) {
    try {
        const histories = JSON.parse(localStorage.getItem('discussionHistories') || '[]');
        
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            question: question,
            discussion: discussion,
            timestamp: Date.now()
        };
        
        histories.unshift(entry);
        
        // En fazla 50 tartışma kaydet
        if (histories.length > 50) {
            histories.pop();
        }
        
        localStorage.setItem('discussionHistories', JSON.stringify(histories));
        updateHistoryDisplay();
    } catch (error) {
        console.error('Geçmiş kaydetme hatası:', error);
    }
}

/**
 * Geçmiş sohbetleri göster/gizle
 */
function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('hidden');
    
    if (!historyPanel.classList.contains('hidden')) {
        updateHistoryDisplay();
    }
}

/**
 * Geçmiş panelini güncelle
 */
function updateHistoryDisplay() {
    try {
        const histories = JSON.parse(localStorage.getItem('discussionHistories') || '[]');
        const historyContent = document.getElementById('historyContent');
        
        if (histories.length === 0) {
            historyContent.innerHTML = '<div class="empty-history">Henüz tartışma yok</div>';
            return;
        }
        
        historyContent.innerHTML = histories.map((item, index) => `
            <div class="history-item" onclick="loadDiscussionFromHistory(${item.id})">
                <div class="history-item-header">
                    <span class="history-date">${item.date}</span>
                    <button class="history-delete" onclick="deleteHistoryItem(${item.id}, event)">✕</button>
                </div>
                <div class="history-item-question">${escapeHtml(item.question.substring(0, 100))}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Geçmiş gösterme hatası:', error);
    }
}

/**
 * Geçmiş tartışmayı yükle
 */
function loadDiscussionFromHistory(id) {
    try {
        const histories = JSON.parse(localStorage.getItem('discussionHistories') || '[]');
        const item = histories.find(h => h.id === id);
        
        if (!item) return;
        
        // Tartışmayı ekrana yükle
        const userInput = document.getElementById('userInput');
        userInput.value = item.question;
        
        // Panelleri temizle
        document.getElementById('claudeContent').innerHTML = '';
        document.getElementById('geminiContent').innerHTML = '';
        document.getElementById('grokContent').innerHTML = '';
        
        // Kaydedilen tartışmayı göster
        if (item.discussion) {
            const panelMap = {
                'claudeInitial': 'claudeContent',
                'geminiInitial': 'geminiContent',
                'grokInitial': 'grokContent'
            };
            Object.entries(item.discussion).forEach(([key, content]) => {
                const panelId = panelMap[key];
                const panel = panelId ? document.getElementById(panelId) : null;
                if (panel && content) {
                    panel.innerHTML = `<div class="message"><div class="message-content">${escapeHtml(content)}</div></div>`;
                }
            });
        }
        
        // Geçmiş panelini kapat
        toggleHistory();
        
        // Scroll to panels
        setTimeout(() => {
            document.getElementById('claudePanel').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } catch (error) {
        console.error('Geçmiş yükleme hatası:', error);
    }
}

/**
 * Geçmiş öğesini sil
 */
function deleteHistoryItem(id, event) {
    event.stopPropagation();
    
    try {
        let histories = JSON.parse(localStorage.getItem('discussionHistories') || '[]');
        histories = histories.filter(h => h.id !== id);
        localStorage.setItem('discussionHistories', JSON.stringify(histories));
        updateHistoryDisplay();
    } catch (error) {
        console.error('Geçmiş silme hatası:', error);
    }
}

/**
 * Tüm geçmişi sil
 */
function clearHistory() {
    if (confirm('Tüm tartışma geçmişini silmek istediğinizden emin misiniz?')) {
        try {
            localStorage.removeItem('discussionHistories');
            updateHistoryDisplay();
            showError('✓ Tüm geçmiş silindi');
        } catch (error) {
            console.error('Geçmiş temizleme hatası:', error);
        }
    }
}

/**
 * HTML özel karakterleri kaçış
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Hata mesajı göster
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span>⚠️ ${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Sonuçlar özeti panelini göster
 */
function showResultsSummary() {
    const resultsSummary = document.getElementById('resultsSummary');
    if (resultsSummary) {
        resultsSummary.classList.remove('hidden');
        resultsSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Özeti kopyala
 */
function copySummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;

    const text = summaryContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Kopyalandı!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Kopyalama hatası:', err);
        showError('Kopyalanırken bir hata oluştu');
    });
}

/**
 * Tartışmayı sıfırla
 */
function resetDiscussion() {
    clearInput();
    const startBtn = document.getElementById('startBtn');
    startBtn.innerHTML = '🚀 Tartışmayı Başlat';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Hakkında panelini göster
 */
function showAbout() {
    // Eğer zaten açıksa kapat
    const existing = document.getElementById('aboutModal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'aboutModal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 1000;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    `;
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #12121a, #1a1a25);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 24px; padding: 2.5rem;
            max-width: 480px; width: 90%;
            box-shadow: 0 25px 60px rgba(0,0,0,0.5);
            animation: slideUp 0.3s ease;
        ">
            <div style="text-align:center; margin-bottom:1.5rem;">
                <span style="font-size:3rem;">⚖️</span>
                <h2 style="
                    font-size:1.5rem; font-weight:800; margin:0.5rem 0;
                    background: linear-gradient(135deg, #6366f1, #10b981, #f59e0b);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                ">Konsey Tartışma Sistemi</h2>
                <p style="color:#a1a1aa; font-size:0.9rem;">v2.0.0</p>
            </div>
            <p style="color:#d4d4d8; line-height:1.7; margin-bottom:1.25rem; text-align:center;">
                Çok ajanlı yapay zeka tartışma platformu
            </p>
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
                <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; background:rgba(99,102,241,0.1); border-radius:10px;">
                    <span style="font-size:1.1rem;">🔬</span>
                    <span style="color:#818cf8; font-weight:600;">Claude</span>
                    <span style="color:#a1a1aa; font-size:0.85rem;">— Metodolog & Analitik</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; background:rgba(16,185,129,0.1); border-radius:10px;">
                    <span style="font-size:1.1rem;">✨</span>
                    <span style="color:#34d399; font-weight:600;">Gemini</span>
                    <span style="color:#a1a1aa; font-size:0.85rem;">— Sentetik Zihin & Yaratıcı</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; background:rgba(245,158,11,0.1); border-radius:10px;">
                    <span style="font-size:1.1rem;">🔥</span>
                    <span style="color:#fbbf24; font-weight:600;">Grok</span>
                    <span style="color:#a1a1aa; font-size:0.85rem;">— Muhalif & Şüpheci</span>
                </div>
            </div>
            <p style="color:#71717a; font-size:0.8rem; text-align:center; margin-bottom:1.5rem;">
                Epistemik kalite için çoğulcu düşünce
            </p>
            <button onclick="document.getElementById('aboutModal').remove()" style="
                width:100%; padding:0.85rem; border:none; border-radius:12px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                color:white; font-size:1rem; font-weight:600; cursor:pointer;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
                Kapat
            </button>
        </div>
    `;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
}

// Global fonksiyon olarak dışa aktar
window.startDiscussion = startDiscussion;
window.clearInput = clearInput;
window.toggleHistory = toggleHistory;
window.updateHistoryDisplay = updateHistoryDisplay;
window.loadDiscussionFromHistory = loadDiscussionFromHistory;
window.deleteHistoryItem = deleteHistoryItem;
window.clearHistory = clearHistory;
window.saveDiscussionToHistory = saveDiscussionToHistory;
window.copySummary = copySummary;
window.resetDiscussion = resetDiscussion;
window.showAbout = showAbout;