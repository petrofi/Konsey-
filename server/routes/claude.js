/**
 * Claude API Integration
 */

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

/** Sanitize user input to prevent prompt injection */
function sanitize(text, maxLen = 2000) {
    if (typeof text !== 'string') return '';
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, maxLen);
}

/**
 * Initial response endpoint
 * POST /api/claude/initial
 */
router.post('/initial', async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Konu gereklidir' });
        }

        const message = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: `Siz Claude'sunuz - Metodolog ve Analitik bir AI danışmanı. 
                    
Verilen konu hakkında sistematik ve metodolojik bir ilk görüş sunun. Varsayımları açıklayın, 
mantıksal çerçeveyi oluşturun. Akademik ama sade dil kullanın.

Konu: "${sanitize(topic)}"

Lütfen 2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Claude:" yazmayın.`
                }
            ]
        });

        res.json({
            agent: 'claude',
            phase: 'initial',
            response: message.content[0].text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Claude API Hatası:', error);
        res.status(500).json({
            error: 'Claude API hatası',
            message: error.message
        });
    }
});

/**
 * Critique endpoint
 * POST /api/claude/critique
 */
router.post('/critique', async (req, res) => {
    try {
        const { targetAgent, targetResponse } = req.body;

        if (!targetAgent || !targetResponse) {
            return res.status(400).json({ 
                error: 'targetAgent ve targetResponse gereklidir' 
            });
        }

        const message = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: `Siz Claude'sunuz - Metodolog ve Analitik bir AI danışmanı.

${targetAgent === 'gemini' ? 'Gemini' : 'Grok'}'nin bu görüşünü eleştirin:

"${sanitize(targetResponse, 3000)}"

Mantıksal hatalar, eksik varsayımlar ve nedensellik vs korelasyon karışıklıkları bulun.
2-3 paragraf halinde yapılandırılmış bir eleştiri verin. Başında "Claude:" yazmayın.`
                }
            ]
        });

        res.json({
            agent: 'claude',
            phase: 'critique',
            target: targetAgent,
            response: message.content[0].text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Claude API Hatası:', error);
        res.status(500).json({
            error: 'Claude API hatası',
            message: error.message
        });
    }
});

/**
 * Revision endpoint
 * POST /api/claude/revision
 */
router.post('/revision', async (req, res) => {
    try {
        const { criticism } = req.body;

        if (!criticism) {
            return res.status(400).json({ error: 'Criticism gereklidir' });
        }

        const message = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: `Siz Claude'sunuz - Metodolog ve Analitik bir AI danışmanı.

Bu eleştiriyi aldınız:

"${sanitize(criticism, 3000)}"

Buna yanıt verin ve görüşünüzü revize edin. Ne değişti, ne değişmedi açıklayın.
2-3 paragraf halinde yapılandırılmış bir yanıt verin. Başında "Claude:" yazmayın.`
                }
            ]
        });

        res.json({
            agent: 'claude',
            phase: 'revision',
            response: message.content[0].text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Claude API Hatası:', error);
        res.status(500).json({
            error: 'Claude API hatası',
            message: error.message
        });
    }
});

module.exports = router;
