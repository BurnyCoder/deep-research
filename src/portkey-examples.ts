import { config } from 'dotenv';
import { generateCompletion, generateFunctionCompletion, PortkeyProvider } from './ai/portkey-provider';

// Load environment variables from .env.local file
config({ path: '.env.local' });

/**
 * Run examples for a specific provider
 * 
 * @param {PortkeyProvider} provider - The provider to use
 */
async function runProviderExamples(provider: PortkeyProvider) {
    try {
        console.log(`\n=== Testing ${provider.toUpperCase()} with Portkey ===`);
        
        // Example 1: Basic completion
        console.log(`\n--- Example 1: ${provider} Basic Completion ---`);
        const basicPrompt = getPromptForProvider(provider, 'basic');
        console.log(`Prompt: "${basicPrompt}"`);
        
        const basicResponse = await generateCompletion(basicPrompt, provider);
        console.log('Response:');
        console.log(basicResponse.choices[0].message.content);
        
        // Example 2: Using a specific model
        const modelName = getModelForProvider(provider);
        console.log(`\n--- Example 2: Using ${modelName} model ---`);
        const creativePrompt = getPromptForProvider(provider, 'creative');
        console.log(`Prompt: "${creativePrompt}"`);
        
        const creativeResponse = await generateCompletion(creativePrompt, provider, modelName, 500);
        console.log('Response:');
        console.log(creativeResponse.choices[0].message.content);
        
    } catch (error) {
        console.error(`Error running ${provider} examples:`, error);
    }
}

/**
 * Run function calling example (OpenAI only)
 */
async function runFunctionCallingExample() {
    try {
        console.log('\n=== Testing Function Calling with OpenAI ===');
        
        // Define a function for weather information
        const weatherFunction = {
            name: "get_weather",
            description: "Get the current weather in a given location",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "The city and state, e.g. San Francisco, CA"
                    },
                    unit: {
                        type: "string",
                        enum: ["celsius", "fahrenheit"],
                        description: "The temperature unit to use"
                    }
                },
                required: ["location"]
            }
        };
        
        const functionPrompt = "What's the weather like in Boston today?";
        console.log(`Prompt: "${functionPrompt}"`);
        
        const functionResponse = await generateFunctionCompletion(
            functionPrompt,
            [weatherFunction]
        );
        
        console.log('Response:');
        if (functionResponse.choices[0].message.tool_calls) {
            console.log('Function called:');
            console.log(JSON.stringify(functionResponse.choices[0].message.tool_calls, null, 2));
        } else {
            console.log(functionResponse.choices[0].message.content);
        }
        
    } catch (error) {
        console.error('Error running function calling example:', error);
    }
}

/**
 * Get an appropriate prompt for a provider and prompt type
 */
function getPromptForProvider(provider: PortkeyProvider, type: 'basic' | 'creative'): string {
    if (type === 'basic') {
        switch (provider) {
            case 'google':
                return 'Explain quantum computing in simple terms';
            case 'openai':
                return 'Describe three innovative applications of blockchain beyond cryptocurrency';
            case 'anthropic':
                return 'What are the ethical considerations of artificial general intelligence?';
            case 'groq':
                return 'Compare and contrast classical machine learning with deep learning';
            default:
                return 'Tell me about the latest advancements in AI';
        }
    } else {
        switch (provider) {
            case 'google':
                return 'Write a short poem about artificial intelligence';
            case 'openai':
                return 'Create a brief science fiction story about robots developing emotions';
            case 'anthropic':
                return 'Devise a creative solution to reduce plastic waste in oceans';
            case 'groq':
                return 'Imagine and describe a day in the life of a person living in 2100';
            default:
                return 'Write a creative story about the future of human-AI collaboration';
        }
    }
}

/**
 * Get an appropriate model for a provider's second example
 */
function getModelForProvider(provider: PortkeyProvider): string {
    switch (provider) {
        case 'google':
            return 'gemini-1.5-flash';
        case 'openai':
            return 'gpt-4-turbo';
        case 'anthropic':
            return 'claude-3-sonnet-20240229';
        case 'groq':
            return 'llama3-8b-8192';
        default:
            return 'gpt-4o';
    }
}

/**
 * Run all examples
 */
async function runAllExamples() {
    const providers: PortkeyProvider[] = ['google', 'openai'];
    
    try {
        // Run examples for each provider
        for (const provider of providers) {
            await runProviderExamples(provider);
        }
        
        // Run function calling example
        await runFunctionCallingExample();
        
        console.log('\nAll examples completed successfully!');
    } catch (error) {
        console.error('Error running examples:', error);
    }
}

// Run the examples if this file is executed directly
if (require.main === module) {
    // Check if a specific provider was requested
    const args = process.argv.slice(2);
    const validProviders: PortkeyProvider[] = ['google', 'openai', 'anthropic', 'groq'];
    
    // Run provider examples if a valid provider is specified
    const requestedProvider = args.find(arg => validProviders.includes(arg as PortkeyProvider)) as PortkeyProvider | undefined;
    
    if (requestedProvider) {
        runProviderExamples(requestedProvider)
            .then(() => {
                if (requestedProvider === 'openai' && args.includes('function')) {
                    return runFunctionCallingExample();
                }
            })
            .then(() => console.log(`\n${requestedProvider.toUpperCase()} examples completed successfully!`))
            .catch(error => console.error(`${requestedProvider.toUpperCase()} examples failed:`, error));
    } else if (args.includes('function')) {
        // Only run function calling example
        runFunctionCallingExample()
            .then(() => console.log('\nFunction calling example completed successfully!'))
            .catch(error => console.error('Function calling example failed:', error));
    } else {
        // Run all examples by default
        runAllExamples()
            .catch(error => console.error('Examples failed:', error));
    }
}

export { runProviderExamples, runFunctionCallingExample, runAllExamples }; 