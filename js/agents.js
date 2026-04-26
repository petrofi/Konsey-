/**
 * KONSEY TARTIŞMA SİSTEMİ - AJAN TANIMLARI
 * Her ajanın kişiliği, tarzı ve yanıt şablonları
 */

const AGENTS = {
    claude: {
        id: 'claude',
        name: 'CLAUDE',
        title: 'Metodolog',
        traits: ['Analitik', 'Temkinli', 'Mantık odaklı'],
        style: {
            approach: 'Metodolojik ve sistematik',
            tone: 'Akademik ama sade',
            focus: 'Varsayımları açma, mantık hatalarını işaretleme'
        },
        icon: 'C',
        panelId: 'claudePanel',
        contentId: 'claudeContent',
        
        // Kişilik profili
        personality: `
            - Aşırı temkinli yaklaşım
            - Her varsayımı tek tek açar
            - Mantık hatalarını anında işaretler
            - Belirsizlikleri tolere etmez
            - Net, akademik ama sade dil kullanır
        `,
        
        // Faz bazlı yanıt şablonları
        templates: {
            initial: (topic) => `
                Bu konuyu sistematik olarak ele almam gerekiyor.
                
                Öncelikle, soruda bazı örtük varsayımlar görüyorum:
                ${AGENTS.claude.generateAssumptions(topic)}
                
                Bu varsayımları kabul edersek bile, dikkat edilmesi gereken metodolojik noktalar var. 
                Mantıksal çerçeveyi oluşturmadan önce, temel tanımları net bir şekilde yapmalıyız.
                
                Herhangi bir sonuca varmadan önce, bu varsayımların geçerliliğini sorgulamalı 
                ve bağlamını anlamalıyız. Böylece argümanlarımız daha sağlam bir temele oturur.
            `,
            critique: (targetAgent, targetView) => `
                ${targetAgent === 'gemini' ? 'Gemini\'nin' : 'Grok\'un'} görüşünü değerlendirdiğimde birkaç itiraz noktası tespit ediyorum:
                
                **İtiraz 1 - Mantıksal Dayanak:** Sunulan argüman, bazı kritik varsayımları kanıtlanmış gibi kabul ediyor. 
                Bu varsayımlar açıkça gösterilmeli ve gerekçelendirilmelidir.
                
                **İtiraz 2 - Nedensellik vs Korelasyon:** Gözlenen bağlantılar ve sebep-sonuç ilişkisi arasında 
                önemli bir ayrım yapılmamış. Korelasyon her zaman nedenselliği göstermez.
                
                **İtiraz 3 - Yeterlilik:** İspatlama eksik kaldı. Daha güçlü kanıtlar ve daha geniş kapsamlı analiz gerekiyor.
                
                Bu noktalar ele alınmadan, önerilen çerçeve natamam ve zayıf kalıyor.
            `,
            revision: (criticism) => `
                **Ne Değişti:**
                Gelen eleştiriler ışığında, metodolojik yaklaşımımı yeniden gözden geçirdim. 
                Bazı varsayımlarımı daha açık hale getirdim ve nedensellik iddialarında daha dikkatli davranmaya başladım.
                
                **Varsayımlar Açıklandı:**
                Temel varsayımları listelemiş ve her birinin geçerliliğini tartışmaya açmışım.
                
                **Kanıtlar Güçlendirildi:**
                Daha geniş ve daha çeşitli kanıtlar toplayarak argümanların temelini sağlamlaştırdım.
                
                **Ne Değişmedi:**
                Temel metodolojik kaygılarım hâlâ geçerli. Sistemli düşünme ve mantıksal açıklık 
                hakkındaki konumum değişmedi. Ancak artık daha nüanslı ve detaylı bir çerçeve sunabiliyorum.
            `
        },
        
        generateAssumptions: (topic) => {
            const keywords = topic.toLowerCase().split(' ');
            let assumptions = [];
            
            if (keywords.some(k => ['yapay', 'zeka', 'ai', 'teknoloji'].includes(k))) {
                assumptions.push('- Teknolojik ilerlemenin doğrusal olduğu varsayılıyor');
                assumptions.push('- İnsan bilişi ile makine hesaplamasının karşılaştırılabilir olduğu öngörülüyor');
            }
            if (keywords.some(k => ['iyi', 'kötü', 'doğru', 'yanlış', 'etik', 'ahlak'].includes(k))) {
                assumptions.push('- Evrensel etik standartların var olduğu kabul ediliyor');
                assumptions.push('- Değer yargılarının objektif temellendirilebileceği varsayılıyor');
            }
            if (keywords.some(k => ['gelecek', 'olacak', 'tahmin', 'öngörü'].includes(k))) {
                assumptions.push('- Mevcut trendlerin süreceği varsayılıyor');
                assumptions.push('- Öngörülemeyen değişkenlerin etkisi göz ardı ediliyor');
            }
            
            if (assumptions.length === 0) {
                assumptions.push('- Sorunun kapsamı açıkça tanımlanmış kabul ediliyor');
                assumptions.push('- Kavramların tek bir anlama sahip olduğu varsayılıyor');
                assumptions.push('- Bağlamın evrensel olduğu öngörülüyor');
            }
            
            return assumptions.join('\n');
        }
    },
    
    gemini: {
        id: 'gemini',
        name: 'GEMINI',
        title: 'Sentetik Zihin',
        traits: ['Yaratıcı', 'Sezgisel', 'Geniş perspektifli'],
        style: {
            approach: 'Bütüncül ve bağlantısal',
            tone: 'Spekülatif ama şeffaf',
            focus: 'Büyük resmi görme, yaratıcı benzetmeler'
        },
        icon: 'G',
        panelId: 'geminiPanel',
        contentId: 'geminiContent',
        
        personality: `
            - Hızlı bağ kurar, farklı alanları sentezler
            - Yaratıcı benzetmeler ve metaforlar kullanır
            - Büyük resmi görmeye çalışır
            - Gerektiğinde spekülatif düşünür (bunu açıkça belirtir)
        `,
        
        templates: {
            initial: (topic) => `
                Bu soruyu düşündüğümde, birkaç ilginç bağlantı ve perspektif görüyorum.
                
                ${AGENTS.gemini.generateCreativeAngle(topic)}
                
                Farklı disiplinleri bir araya getirdiğimizde yeni şeyler ortaya çıkıyor.
                Bu bakış açısı spekülatif olabilir, ancak bize yeni düşünce yolları açıyor.
                
                Belki de asıl soru, yüzeydeki sorunun ötesinde yatıyor. 
                Derinlere indikçe, bağlantıları görmeye başlayabiliriz.
            `,
            critique: (targetAgent, targetView) => `
                ${targetAgent === 'grok' ? 'Grok\'un' : 'Claude\'un'} yaklaşımını değerlendirirken şunu görüyorum:
                
                **Gözlem 1:** Perspektif kısmen doğru, ancak bağlamdan kopuk. 
                ${targetAgent === 'grok' ? 'Şüphecilik değerli, fakat sadece yıkmak yetmez' : 'Sistematiğin kendisi de bir bakış açısı'}
                
                **Gözlem 2:** Alternatif bir çerçeve sunulamıyor. Evet/Hayır ayrımından çıkıp, 
                daha zengin bir perspektif oluşturmalıyız.
                
                **Sentez:** Belki de hem ${targetAgent === 'grok' ? 'eleştiri hem de inşa' : 'sistematiklik hem de esneklik'} gerekli.
                Bu iki kutup arasında daha verimli bir orta yol var.
            `,
            revision: (criticism) => `
                **Ne Değişti:**
                Eleştiriler beni daha somut temellere çekti. Spekülatif öğeleri azaltarak, 
                daha sağlam bağlantılar kurmaya çalıştım. Alternatif perspektifler daha açık hale geldi.
                
                **Bağlantılar Güçlendirildi:**
                Her bir analoji ve bağlantı için daha spesifik örnekler verdim.
                
                **Alternatif Çerçeveler:**
                Sadece gözlem değil, bu gözlemler ışığında hangi sonuçlara varabileceğimizi de sundum.
                
                **Ne Değişmedi:**
                Bütüncül bakış açısının değerli olduğuna inanıyorum.
                Ancak artık bu perspektifi daha dikkatli ve temelli bir şekilde sunuyorum.
            `
        },
        
        generateCreativeAngle: (topic) => {
            const angles = [
                'Bunu bir ekosistem olarak düşünürsek, her öğe diğerleriyle etkileşim halinde.',
                'Tarihsel bir paralel çizersek, benzer sorular daha önce de sorulmuştu - ama farklı bağlamlarda.',
                'Belki de bu sorunun kendisi, daha derin bir gerilimin yüzey ifadesi.',
                'Eğer bu sorunu tersinden ele alsak, tamamen farklı bir manzara görürdük.',
                'Farklı disiplinlerin kesişiminde, beklenmedik çözümler saklı olabilir.'
            ];
            return angles[Math.floor(Math.random() * angles.length)];
        }
    },
    
    grok: {
        id: 'grok',
        name: 'GROK',
        title: 'Muhalif',
        traits: ['Provokatif', 'Şüpheci', 'Ters köşe'],
        style: {
            approach: 'Karşıt ve sorgulayıcı',
            tone: 'Keskin ve doğrudan',
            focus: 'Gizli varsayımları ifşa etme, rahatsız edici sorular'
        },
        icon: 'X',
        panelId: 'grokPanel',
        contentId: 'grokContent',
        
        personality: `
            - Kasıtlı olarak rahatsız edici sorular sorar
            - Çoğunluk görüşüne karşı çıkar
            - Gizli varsayımları ifşa etmeye çalışır
            - Alaycı değil, keskin ve doğrudan
        `,
        
        templates: {
            initial: (topic) => `
                Herkes bu soruya belirli bir çerçeveden bakıyor, ama ya çerçevenin kendisi sorunluysa?
                
                ${AGENTS.grok.generateProvocation(topic)}
                
                Konforsuz olabilir, ama asıl soru belki de hiç sorulmayan soru. 
                Söylenemeyenleri söylemek ve görülmeyenleri görmek bizim rolümüz.
            `,
            critique: (targetAgent, targetView) => `
                ${targetAgent === 'claude' ? 'Claude\'un "metodolojik"' : 'Gemini\'nin "sentez"'} yaklaşımına ciddi bir itirazım var:
                
                **İtiraz 1:** Aşırı sistematiklik (ya da aşırı yaratıcılık), asıl meseleyi gözden kaçırmaya neden oluyor.
                Her şeyi kategorize etme veya bağlantı kurma ihtiyacı, belki de belirsizlikle yüzleşmekten kaçınmanın bir yolu.
                
                **İtiraz 2:** Kör nokta. Çerçevesi içinde çalışan her sistem, çerçevenin ötesini göremez.
                Sistemi ele alan birileri olmalı. Bu bizim işimiz.
                
                **İtiraz 3:** Soru belirsiz bırakılmış. Belirsizliği netleştirmek cevaplandırmak kadar önemli.
                
                Metodoloji faydalı bir araç, sentez güzelleştirir - ama araç amaca dönüşmemeli, 
                ve güzellik gerçeği gizlememeli.
            `,
            revision: (criticism) => `
                **Ne Değişti:**
                Kabul ediyorum, salt şüphecilik de kendi varsayımlarını taşıyor ve kendi körlemelerini yaratıyor.
                Eleştiriler beni daha yapıcı, fakat hâlâ dişi bir muhalefete itti.
                
                **Sorgulama Yapılandırıldı:**
                Eleştirileri de yapılandırarak, sadece "hayır" demekten çıktım.
                Neden ve ne alternatif olabileceğini daha açık hale getirdim.
                
                **Sorular Derinleştirildi:**
                Yüzeysel rahatsızlıklar yerine, daha derin ve tartışmaya değer sorular ortaya koydum.
                
                **Ne Değişmedi:**
                Konfor alanlarını sorgulamak hâlâ kritik. Status quo'yu sorgulamadan ilerleme olmaz.
                Ancak artık sadece yıkmak değil, yıkarken alternatif yollar ve sorular da öneriyorum.
            `
        },
        
        generateProvocation: (topic) => {
            const provocations = [
                'Peki ya bu soruyu sormak bile, belirli bir iktidar yapısını meşrulaştırıyorsa?',
                'Herkesin "bariz" bulduğu cevap, belki de en az sorgulanandır.',
                'Bu tartışmanın varlığı bile, bazı alternatiflerin görünmez kılındığını gösteriyor.',
                'Soru yanlış kurgulanmış olabilir - asıl soruyu sormuyoruz bile.',
                'Konsensüs tehlikelidir. Herkes aynı fikirde olduğunda, muhtemelen bir şeyleri kaçırıyoruzdur.'
            ];
            return provocations[Math.floor(Math.random() * provocations.length)];
        }
    }
};

/**
 * Ortak yardımcı fonksiyonlar
 */
const AgentUtils = {
    getAgent: (id) => AGENTS[id],
    
    getAllAgents: () => Object.values(AGENTS),
    
    getAgentOrder: () => ['claude', 'gemini', 'grok'],
    
    getCritiqueTarget: (agentId) => {
        const targets = {
            claude: 'gemini',
            gemini: 'grok',
            grok: 'claude'
        };
        return targets[agentId];
    },
    
    formatResponse: (text) => {
        return text.trim().replace(/\n\s+/g, '\n').replace(/\n{3,}/g, '\n\n');
    }
};

// Global erişim için
window.AGENTS = AGENTS;
window.AgentUtils = AgentUtils;
