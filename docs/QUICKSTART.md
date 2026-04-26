# 🚀 Konsey Tartışma Sistemi - Hızlı Başlangıç

## 5 Dakikada Başlatın

### 1️⃣ Node.js Yükle
https://nodejs.org/ adresinden LTS versiyonunu indirin ve yükleyin.

### 2️⃣ Bağımlılıkları Yükle
```bash
cd konsey
npm install
```

### 3️⃣ API Anahtarlarını Al

#### 🔵 Claude (Anthropic)
- https://console.anthropic.com adresine git
- "Create API Key" butonuna tıkla
- Anahtarı kopyala

#### 🟢 Gemini (Google)
- https://makersuite.google.com/app/apikey adresine git
- Anahtarı oluştur ve kopyala

#### 🟠 Grok (xAI)
- https://console.groq.com adresine git
- Anahtarı oluştur ve kopyala

### 4️⃣ .env Dosyasını Düzenle
```bash
# Windows'ta Notepad ile aç
notepad .env
```

```env
CLAUDE_API_KEY=sk-ant-... (buraya yapıştır)
GEMINI_API_KEY=AIzaSy... (buraya yapıştır)
GROK_API_KEY=gsk_... (buraya yapıştır)
```

### 5️⃣ Sunucuyu Başlat
```bash
npm run dev
```

✅ **Hazırız!** Tarayıcında açın: http://localhost:3000

---

## 🎯 Şimdi Ne Yapmalısın?

1. **Tartışma Başlat**: Bir soru yaz ve "Tartışmayı Başlat" butonuna tıkla
2. **Sonucu Gözlemle**: 3 AI ajan tartışacak
3. **Özeti Kopyala**: Sonucu kopyala ve paylaş

---

## ⚠️ Hatalar Çözümü

### "npm: command not found"
→ Node.js yüklü değil. https://nodejs.org/ adresinden yükle

### "Cannot find module"
→ Çalıştır: `npm install`

### "API Key undefined"
→ `.env` dosyasını kontrol et, anahtarları ekle

### "Port 3000 already in use"
→ Başka bir port kullan: `PORT=3001 npm run dev`

---

## 📚 Daha Fazla Bilgi

- Detaylı rehber: `API_SETUP.md`
- Geliştirmeler: `IMPROVEMENTS.md`
- Kontrol listesi: `CHECKLIST.md`
- Kullanım rehberi: `README.md`

---

## 🔗 Faydalı Linkler

| Hizmet | Link |
|--------|------|
| Claude | https://console.anthropic.com |
| Gemini | https://makersuite.google.com/app/apikey |
| Grok | https://console.groq.com |
| Node.js | https://nodejs.org/ |

---

**💡 İpucu**: Karmaşık sorular en iyi sonuçlar verir!

**Örnek Sorular:**
- "Yapay zekanın eğitime etkisi nedir?"
- "Demokrasinin geleceği nasıl şekillenecek?"
- "İklim değişikliği ile mücadelede hangi yaklaşım doğru?"

---

Başarılı tartışmalar! 🎉
