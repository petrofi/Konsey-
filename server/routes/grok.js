/**
 * Grok API Integration (via Groq inference API)
 */

const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROK_API_KEY
});

/** Sanitize user input to prevent prompt injection */
function sanitize(text, maxLen = 2000) {
    if (typeof text !== 'string') return '';
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, maxLen);
}

/**
 * Initial response endpoint
 * POST /api/grok/initial
 */
router.post('/initial', async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Konu gereklidir' });
        }

        const message = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Siz Grok'sunuz - Muhalif, şüpheci ve keskin sorgulamacı bir AI.

Verilen konu hakkında rahatsız edici sorular sorun, gizli varsayımları ifşa edin, 
çerçevenin kendisini sorgulamaya yöneltin. Çoğunluk görüşüne karşı çıkın.

Konu: "${sanitize(topic)}"

Lütfen 2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Grok:" yazmayın.`
                }
            ],
            model: process.env.GROK_MODEL || 'llama-3.1-70b-versatile',
            temperature: 1,
            max_tokens: 1024,
        });

        res.json({
            agent: 'grok',
            phase: 'initial',
            response: message.choices[0].message.content,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Grok API Hatası:', error);
        res.status(500).json({
            error: 'Grok API hatası',
            message: error.message
        });
    }
});

/**
 * Critique endpoint
 * POST /api/grok/critique
 */
router.post('/critique', async (req, res) => {
    try {
        const { targetAgent, targetResponse } = req.body;

        if (!targetAgent || !targetResponse) {
            return res.status(400).json({ 
                error: 'targetAgent ve targetResponse gereklidir' 
            });
        }

        const message = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Siz Grok'sunuz - Muhalif, şüpheci ve keskin sorgulamacı bir AI.

${targetAgent === 'claude' ? 'Claude' : 'Gemini'}'un bu görüşünü sorgulayın:

"${sanitize(targetResponse, 3000)}"

Gizli varsayımları ortaya çıkarın, çerçevenin sorunlarını gösterin, rahatsız edici alternatifler sunun.
2-3 paragraf halinde yapılandırılmış bir eleştiri verin. Başında "Grok:" yazmayın.`
                }
            ],
            model: process.env.GROK_MODEL || 'llama-3.1-70b-versatile',
            temperature: 1,
            max_tokens: 1024,
        });

        res.json({
            agent: 'grok',
            phase: 'critique',
            target: targetAgent,
            response: message.choices[0].message.content,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Grok API Hatası:', error);
        res.status(500).json({
            error: 'Grok API hatası',
            message: error.message
        });
    }
});

/**
 * Revision endpoint
 * POST /api/grok/revision
 */
router.post('/revision', async (req, res) => {
    try {
        const { criticism } = req.body;

        if (!criticism) {
            return res.status(400).json({ error: 'Criticism gereklidir' });
        }

        const message = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `Siz Grok'sunuz - Muhalif, şüpheci ve keskin sorgulamacı bir AI.

Bu eleştiriyi aldınız:

"${sanitize(criticism, 3000)}"

Buna yapıcı bir şekilde yanıt verin. Doğru olanları kabul edin ama sorgulama yapısını koruyun.
2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Grok:" yazmayın.`
                }
            ],
            model: process.env.GROK_MODEL || 'llama-3.1-70b-versatile',
            temperature: 1,
            max_tokens: 1024,
        });

        res.json({
            agent: 'grok',
            phase: 'revision',
            response: message.choices[0].message.content,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Grok API Hatası:', error);
        res.status(500).json({
            error: 'Grok API hatası',
            message: error.message
        });
    }
});

module.exports = router;
