import { Portkey } from 'portkey-ai';

/**
 * Supported provider types for Portkey
 */
export type PortkeyProvider = 'google' | 'openai' | 'anthropic' | 'groq';

/**
 * Initialize a Portkey client for accessing AI models
 * 
 * @param {PortkeyProvider} provider - The provider to use (google, openai, anthropic, groq)
 * @returns {Portkey} Configured Portkey client
 */
export function createPortkeyClient(provider: PortkeyProvider): Portkey {
    const apiKey = process.env.PORTKEY_API_KEY || '';
    let virtualKey = '';
    
    // Select the appropriate virtual key based on the provider
    switch (provider) {
        case 'google':
            virtualKey = process.env.PORTKEY_VIRTUAL_KEY_GOOGLE || '';
            break;
        case 'openai':
            virtualKey = process.env.PORTKEY_VIRTUAL_KEY_OPENAI || '';
            break;
        case 'anthropic':
            virtualKey = process.env.PORTKEY_VIRTUAL_KEY_ANTHROPIC || '';
            break;
        case 'groq':
            virtualKey = process.env.PORTKEY_VIRTUAL_KEY_GROQ || '';
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
    
    if (!virtualKey) {
        throw new Error(`No virtual key found for provider: ${provider}. Please set PORTKEY_VIRTUAL_KEY_${provider.toUpperCase()} in your .env.local file.`);
    }
    
    // Initialize Portkey with the API key and virtual key
    return new Portkey({
        apiKey: apiKey,
        virtualKey: virtualKey,
    });
}

/**
 * Default models for each provider
 */
export const DEFAULT_MODELS = {
    google: 'gemini-1.5-pro',
    openai: 'gpt-4o',
    anthropic: 'claude-3-opus-20240229',
    groq: 'llama3-70b-8192'
};

/**
 * Send a request to an AI model via Portkey
 * 
 * @param {string} prompt - The user's prompt
 * @param {PortkeyProvider} provider - The provider to use (google, openai, anthropic, groq)
 * @param {string} model - The model to use (defaults to provider's default model)
 * @param {number} maxTokens - Maximum tokens to generate (default: 1024)
 * @returns {Promise<any>} The completion response
 */
export async function generateCompletion(
    prompt: string,
    provider: PortkeyProvider = 'openai',
    model?: string,
    maxTokens: number = 1024,
): Promise<any> {
    // Use default model if none provided
    const selectedModel = model || DEFAULT_MODELS[provider];
    const portkey = createPortkeyClient(provider);

    try {
        const chatCompletion = await portkey.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ],
            model: selectedModel,
            max_tokens: maxTokens,
        });

        return chatCompletion;
    } catch (error) {
        console.error(`Error generating completion with ${provider}:`, error);
        throw error;
    }
}

/**
 * Generate a response using OpenAI with function calling capabilities
 * 
 * @param {string} prompt - The user's prompt
 * @param {any[]} functions - Array of function definitions
 * @param {string} model - The OpenAI model to use (default: 'gpt-4o')
 * @returns {Promise<any>} The completion response from OpenAI
 */
export async function generateFunctionCompletion(
    prompt: string,
    functions: any[],
    model: string = 'gpt-4o',
): Promise<any> {
    const portkey = createPortkeyClient('openai');

    try {
        const chatCompletion = await portkey.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ],
            model: model,
            max_tokens: 1024,
            tools: functions.map(func => ({
                type: 'function',
                function: func
            })),
            tool_choice: 'auto',
        });

        return chatCompletion;
    } catch (error) {
        console.error('Error generating function completion with OpenAI:', error);
        throw error;
    }
} 