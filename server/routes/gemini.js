/**
 * Gemini API Integration
 */

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/** Sanitize user input to prevent prompt injection */
function sanitize(text, maxLen = 2000) {
    if (typeof text !== 'string') return '';
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, maxLen);
}

/**
 * Initial response endpoint
 * POST /api/gemini/initial
 */
router.post('/initial', async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Konu gereklidir' });
        }

        const model = genAI.getGenerativeModel({ 
            model: process.env.GEMINI_MODEL || 'gemini-pro' 
        });

        const prompt = `Siz Gemini'siniz - Sentetik Zihin, yaratıcı ve bağlantısal düşünen bir AI.

Verilen konu hakkında farklı perspektiflerden bağlantılar kurun, yaratıcı benzetmeler yapın, 
büyük resmi görün. Spekulatif olabilirsiniz ama şeffaf olun.

Konu: "${sanitize(topic)}"

Lütfen 2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Gemini:" yazmayın.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            agent: 'gemini',
            phase: 'initial',
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API Hatası:', error);
        res.status(500).json({
            error: 'Gemini API hatası',
            message: error.message
        });
    }
});

/**
 * Critique endpoint
 * POST /api/gemini/critique
 */
router.post('/critique', async (req, res) => {
    try {
        const { targetAgent, targetResponse } = req.body;

        if (!targetAgent || !targetResponse) {
            return res.status(400).json({ 
                error: 'targetAgent ve targetResponse gereklidir' 
            });
        }

        const model = genAI.getGenerativeModel({ 
            model: process.env.GEMINI_MODEL || 'gemini-pro' 
        });

        const prompt = `Siz Gemini'siniz - Sentetik Zihin, yaratıcı ve bağlantısal düşünen bir AI.

${targetAgent === 'claude' ? 'Claude' : 'Grok'}'un bu görüşünü analiz edin:

"${sanitize(targetResponse, 3000)}"

Eksik perspektifler, bağlantısız noktalar, daha geniş bir çerçevenin gerekliliğini gösterin.
2-3 paragraf halinde yapılandırılmış bir eleştiri verin. Başında "Gemini:" yazmayın.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            agent: 'gemini',
            phase: 'critique',
            target: targetAgent,
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API Hatası:', error);
        res.status(500).json({
            error: 'Gemini API hatası',
            message: error.message
        });
    }
});

/**
 * Revision endpoint
 * POST /api/gemini/revision
 */
router.post('/revision', async (req, res) => {
    try {
        const { criticism } = req.body;

        if (!criticism) {
            return res.status(400).json({ error: 'Criticism gereklidir' });
        }

        const model = genAI.getGenerativeModel({ 
            model: process.env.GEMINI_MODEL || 'gemini-pro' 
        });

        const prompt = `Siz Gemini'siniz - Sentetik Zihin, yaratıcı ve bağlantısal düşünen bir AI.

Bu eleştiriyi aldınız:

"${sanitize(criticism, 3000)}"

Buna yanıt verin ve görüşünüzü revize edin. Yeni bağlantılar kurun, perspektifi genişletin.
2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Gemini:" yazmayın.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            agent: 'gemini',
            phase: 'revision',
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API Hatası:', error);
        res.status(500).json({
            error: 'Gemini API hatası',
            message: error.message
        });
    }
});

module.exports = router;
