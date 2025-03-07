import { config } from 'dotenv';
import { generateCompletion, generateFunctionCompletion } from './ai/portkey-provider';

// Load environment variables from .env.local file
config({ path: '.env.local' });

/**
 * Example of using Google Gemini with Portkey
 */
async function runGeminiExamples() {
    try {
        console.log('=== Testing Google Gemini with Portkey ===');
        
        // Example 1: Simple text completion with Gemini
        console.log('\n--- Example 1: Gemini Text Completion ---');
        const textPrompt = 'Explain quantum computing in simple terms';
        console.log(`Prompt: "${textPrompt}"`);
        
        const textResponse = await generateCompletion(textPrompt, 'google');
        console.log('Response:');
        console.log(textResponse.choices[0].message.content);
        
        // Example 2: Using a different Gemini model
        console.log('\n--- Example 2: Using gemini-1.5-flash model ---');
        const flashPrompt = 'Write a short poem about artificial intelligence';
        console.log(`Prompt: "${flashPrompt}"`);
        
        const flashResponse = await generateCompletion(
            flashPrompt, 
            'google',
            'gemini-1.5-flash', 
            300
        );
        console.log('Response:');
        console.log(flashResponse.choices[0].message.content);
        
    } catch (error) {
        console.error('Error running Gemini examples:', error);
    }
}

/**
 * Example of using OpenAI with Portkey
 */
async function runOpenAIExamples() {
    try {
        console.log('\n=== Testing OpenAI with Portkey ===');
        
        // Example 1: Simple text completion with OpenAI
        console.log('\n--- Example 1: OpenAI Text Completion ---');
        const openaiPrompt = 'Describe three innovative applications of blockchain beyond cryptocurrency';
        console.log(`Prompt: "${openaiPrompt}"`);
        
        const openaiResponse = await generateCompletion(openaiPrompt, 'openai');
        console.log('Response:');
        console.log(openaiResponse.choices[0].message.content);
        
        // Example 2: Function calling with OpenAI
        console.log('\n--- Example 2: OpenAI Function Calling ---');
        
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
        console.error('Error running OpenAI examples:', error);
    }
}

/**
 * Run all example API calls
 */
async function runAllExamples() {
    try {
        // Run Gemini examples
        await runGeminiExamples();
        
        // Run OpenAI examples 
        await runOpenAIExamples();
        
        console.log('\nAll examples completed successfully!');
    } catch (error) {
        console.error('Error running examples:', error);
    }
}

// Run the examples if this file is executed directly
if (require.main === module) {
    // Check if a specific example type was requested via command line argument
    const args = process.argv.slice(2);
    if (args.includes('gemini')) {
        runGeminiExamples()
            .then(() => console.log('\nGemini examples completed successfully!'))
            .catch(error => console.error('Gemini examples failed:', error));
    } else if (args.includes('openai')) {
        runOpenAIExamples()
            .then(() => console.log('\nOpenAI examples completed successfully!'))
            .catch(error => console.error('OpenAI examples failed:', error));
    } else {
        // Run all examples by default
        runAllExamples()
            .catch(error => console.error('Examples failed:', error));
    }
}

export { runGeminiExamples, runOpenAIExamples, runAllExamples }; 