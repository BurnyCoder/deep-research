import { Portkey } from 'portkey-ai';

/**
 * Initialize a Portkey client for accessing Google Gemini models
 * 
 * @returns {Portkey} Configured Portkey client for Gemini
 */
export function createGeminiClient() {
    // Initialize Portkey with the API key and virtual key
    const portkey = new Portkey({
        apiKey: process.env.PORTKEY_API_KEY || '',
        virtualKey: process.env.PORTKEY_VIRTUAL_KEY_GOOGLE || '',
    });

    return portkey;
}

/**
 * Send a request to Gemini model via Portkey
 * 
 * @param {string} prompt - The user's prompt to send to Gemini
 * @param {string} model - The Gemini model to use (default: 'gemini-1.5-pro')
 * @param {number} maxTokens - Maximum tokens to generate (default: 1024)
 * @returns {Promise<any>} The completion response from Gemini
 */
export async function generateGeminiCompletion(
    prompt: string,
    model: string = 'gemini-1.5-pro',
    maxTokens: number = 1024,
): Promise<any> {
    const portkey = createGeminiClient();

    try {
        const chatCompletion = await portkey.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ],
            model: model,
            max_tokens: maxTokens,
        });

        return chatCompletion;
    } catch (error) {
        console.error('Error generating completion with Gemini:', error);
        throw error;
    }
}

/**
 * Send a request to Gemini with image input
 * 
 * @param {string} imageUrl - URL to the image
 * @param {string} prompt - Text prompt to accompany the image
 * @param {string} model - Gemini model to use (default: 'gemini-1.5-pro-vision')
 * @returns {Promise<any>} The completion response from Gemini
 */
export async function generateGeminiImageCompletion(
    imageUrl: string,
    prompt: string,
    model: string = 'gemini-1.5-pro'
): Promise<any> {
    const portkey = createGeminiClient();

    try {
        const chatCompletion = await portkey.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { 
                    role: 'user', 
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ],
            model: model,
            max_tokens: 500,
        });

        return chatCompletion;
    } catch (error) {
        console.error('Error generating image completion with Gemini:', error);
        throw error;
    }
} 