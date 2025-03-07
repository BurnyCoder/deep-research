import { config } from 'dotenv';
import { generateCompletion } from './ai/portkey-provider';

// Load environment variables from .env.local file
config({ path: '.env.local' });

/**
 * Example of using Google Gemini with Portkey
 */
async function runGeminiExample() {
    try {
        console.log('Testing Google Gemini with Portkey...');
        
        // Example 1: Simple text completion
        console.log('\n--- Example 1: Text Completion ---');
        const textPrompt = 'Explain quantum computing in simple terms';
        console.log(`Prompt: "${textPrompt}"`);
        
        const textResponse = await generateCompletion(textPrompt, 'google');
        console.log('Response:');
        console.log(textResponse.choices[0].message.content);
        
        // Example 2: Using a different model
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
        
        // Example 3: Complex query with specific instructions
        console.log('\n--- Example 3: Complex Query ---');
        const complexPrompt = 'Provide 3 practical tips for improving time management skills for remote workers';
        console.log(`Prompt: "${complexPrompt}"`);
        
        const complexResponse = await generateCompletion(complexPrompt, 'google');
        console.log('Response:');
        console.log(complexResponse.choices[0].message.content);
        
    } catch (error) {
        console.error('Error running Gemini examples:', error);
    }
}

// Run the example if this file is executed directly
if (require.main === module) {
    runGeminiExample()
        .then(() => console.log('Example completed successfully!'))
        .catch(error => console.error('Example failed:', error));
}

export { runGeminiExample }; 