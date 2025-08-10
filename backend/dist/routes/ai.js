"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
let openai = null;
const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
        return null;
    }
    if (!openai) {
        openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
};
router.post('/improve-text', [
    (0, express_validator_1.body)('text').isLength({ min: 1 }).trim(),
    (0, express_validator_1.body)('prompt').optional().isString().trim(),
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { text, prompt } = req.body;
        const client = getOpenAIClient();
        // Return mock improvement if OpenAI is not configured
        if (!client) {
            logger_1.logger.info('OpenAI not configured, using mock text improvement');
            // Simple mock improvement - just clean up spacing and add structure
            const improvedText = text
                .trim()
                .replace(/\s+/g, ' ')
                .split('. ')
                .map((sentence) => sentence.trim())
                .filter((sentence) => sentence.length > 0)
                .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1) +
                (sentence.endsWith('.') ? '' : '.'))
                .join(' ');
            return res.json({
                improvedText: `${improvedText}\n\n[Note: AI assistance is not configured. This is basic text formatting only.]`,
                original: text,
            });
        }
        const systemPrompt = `You are an AI assistant helping factory workers write clear, professional reports about workplace concerns. 
        Keep the language simple and direct. Maintain the original meaning while improving clarity and professionalism.
        Do not add information that wasn't in the original text.`;
        const userPrompt = prompt
            ? `${prompt}\n\nOriginal text: ${text}`
            : `Please improve the following text to make it clearer and more professional:\n\n${text}`;
        const response = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        const improvedText = response.choices[0].message.content;
        logger_1.logger.info('Text improvement completed');
        res.json({
            improvedText,
            original: text,
        });
    }
    catch (error) {
        logger_1.logger.error('AI text improvement failed:', error);
        next(new errorHandler_1.AppError('Failed to improve text', 500));
    }
});
router.post('/assist', [
    (0, express_validator_1.body)('text').isLength({ min: 1 }).trim(),
    (0, express_validator_1.body)('taskType').isIn(['improve_clarity', 'make_professional', 'fix_grammar', 'create_summary']),
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task type. Allowed types: improve_clarity, make_professional, fix_grammar, create_summary'
            });
        }
        const { text, taskType } = req.body;
        const client = getOpenAIClient();
        // Return mock improvement if OpenAI is not configured
        if (!client) {
            logger_1.logger.info('OpenAI not configured, using mock AI assistance');
            const taskNames = {
                improve_clarity: 'Improve Clarity',
                make_professional: 'Make Professional',
                fix_grammar: 'Fix Grammar',
                create_summary: 'Create Summary'
            };
            // Simple mock improvement based on task type
            let improvedText = text.trim();
            switch (taskType) {
                case 'improve_clarity':
                    improvedText = improvedText.charAt(0).toUpperCase() + improvedText.slice(1);
                    if (!improvedText.endsWith('.'))
                        improvedText += '.';
                    break;
                case 'make_professional':
                    improvedText = `I would like to report that ${improvedText.toLowerCase()}.`;
                    break;
                case 'fix_grammar':
                    improvedText = improvedText.replace(/\s+/g, ' ').trim();
                    break;
                case 'create_summary':
                    improvedText = improvedText.slice(0, 50) + (improvedText.length > 50 ? '...' : '');
                    break;
            }
            return res.json({
                success: true,
                taskType,
                taskName: taskNames[taskType],
                originalLength: text.length,
                improvedLength: improvedText.length,
                improvedText,
            });
        }
        // Real OpenAI processing would go here
        res.json({
            success: true,
            taskType,
            improvedText: text, // Placeholder
        });
    }
    catch (error) {
        logger_1.logger.error('AI assistance failed:', error);
        next(error);
    }
});
router.post('/generate-summary', [(0, express_validator_1.body)('reportId').isUUID()], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({
            summary: 'Report summary generation will be implemented',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=ai.js.map