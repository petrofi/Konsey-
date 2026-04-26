/**
 * API Configuration
 * Frontend API çağrılarının ayarlandığı yer
 */

const API_CONFIG = {
    // API Sunucusu Base URL
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : window.location.origin,
    
    // API Endpoints
    ENDPOINTS: {
        HEALTH: '/api/health',
        CLAUDE: {
            INITIAL: '/api/claude/initial',
            CRITIQUE: '/api/claude/critique',
            REVISION: '/api/claude/revision'
        },
        GEMINI: {
            INITIAL: '/api/gemini/initial',
            CRITIQUE: '/api/gemini/critique',
            REVISION: '/api/gemini/revision'
        },
        GROK: {
            INITIAL: '/api/grok/initial',
            CRITIQUE: '/api/grok/critique',
            REVISION: '/api/grok/revision'
        }
    },
    
    // Timeout settings
    TIMEOUT: 30000, // 30 saniye
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 saniye
};

/**
 * API Call Wrapper
 */
class APIClient {
    constructor(config = {}) {
        this.baseURL = config.baseURL || API_CONFIG.BASE_URL;
        this.timeout = config.timeout || API_CONFIG.TIMEOUT;
        this.maxRetries = config.maxRetries || API_CONFIG.MAX_RETRIES;
        this.retryDelay = config.retryDelay || API_CONFIG.RETRY_DELAY;
    }

    /**
     * Health check
     */
    async checkHealth() {
        try {
            const response = await this.fetch(API_CONFIG.ENDPOINTS.HEALTH, {
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error('API Health Check Hatası:', error);
            return null;
        }
    }

    /**
     * Claude Initial Response
     */
    async getClaudeInitial(topic) {
        return this.fetch(API_CONFIG.ENDPOINTS.CLAUDE.INITIAL, {
            method: 'POST',
            body: JSON.stringify({ topic })
        });
    }

    /**
     * Claude Critique
     */
    async getClaudeCritique(targetAgent, targetResponse) {
        return this.fetch(API_CONFIG.ENDPOINTS.CLAUDE.CRITIQUE, {
            method: 'POST',
            body: JSON.stringify({ targetAgent, targetResponse })
        });
    }

    /**
     * Claude Revision
     */
    async getClaudeRevision(criticism) {
        return this.fetch(API_CONFIG.ENDPOINTS.CLAUDE.REVISION, {
            method: 'POST',
            body: JSON.stringify({ criticism })
        });
    }

    /**
     * Gemini Initial Response
     */
    async getGeminiInitial(topic) {
        return this.fetch(API_CONFIG.ENDPOINTS.GEMINI.INITIAL, {
            method: 'POST',
            body: JSON.stringify({ topic })
        });
    }

    /**
     * Gemini Critique
     */
    async getGeminiCritique(targetAgent, targetResponse) {
        return this.fetch(API_CONFIG.ENDPOINTS.GEMINI.CRITIQUE, {
            method: 'POST',
            body: JSON.stringify({ targetAgent, targetResponse })
        });
    }

    /**
     * Gemini Revision
     */
    async getGeminiRevision(criticism) {
        return this.fetch(API_CONFIG.ENDPOINTS.GEMINI.REVISION, {
            method: 'POST',
            body: JSON.stringify({ criticism })
        });
    }

    /**
     * Grok Initial Response
     */
    async getGrokInitial(topic) {
        return this.fetch(API_CONFIG.ENDPOINTS.GROK.INITIAL, {
            method: 'POST',
            body: JSON.stringify({ topic })
        });
    }

    /**
     * Grok Critique
     */
    async getGrokCritique(targetAgent, targetResponse) {
        return this.fetch(API_CONFIG.ENDPOINTS.GROK.CRITIQUE, {
            method: 'POST',
            body: JSON.stringify({ targetAgent, targetResponse })
        });
    }

    /**
     * Grok Revision
     */
    async getGrokRevision(criticism) {
        return this.fetch(API_CONFIG.ENDPOINTS.GROK.REVISION, {
            method: 'POST',
            body: JSON.stringify({ criticism })
        });
    }

    /**
     * Generic fetch with retry logic
     */
    async fetch(endpoint, options = {}, retryCount = 0) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            
            const fetchPromise = fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            // Timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('API İsteği Zaman Aşımına Uğradı')), this.timeout)
            );

            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            // Retry logic
            if (retryCount < this.maxRetries) {
                console.warn(`Yeniden deneme ${retryCount + 1}/${this.maxRetries}:`, error.message);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.fetch(endpoint, options, retryCount + 1);
            }

            throw error;
        }
    }
}

// Global API Client instance
const apiClient = new APIClient();

// Window'a ata (gerekirse)
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
    window.API_CONFIG = API_CONFIG;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, apiClient, API_CONFIG };
}
