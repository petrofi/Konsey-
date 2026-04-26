/**
 * Konsey Tartışma Sistemi - Backend Sunucusu
 * Node.js + Express
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// .env dosyasını yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../')));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    message: 'Bu IP adresinden çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.'
});
app.use('/api/', limiter);

// API Routes
app.use('/api/claude', require('./routes/claude'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/grok', require('./routes/grok'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            claude: !!process.env.CLAUDE_API_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
            grok: !!process.env.GROK_API_KEY
        }
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Sunucu hatası' 
            : err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint bulunamadı',
        path: req.path
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🏛️ Konsey Sunucusu ${PORT} portunda çalışıyor`);
    console.log(`📋 API Status: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Web: http://localhost:${PORT}`);
});

module.exports = app;
