import subprocess
import json
import os
from typing import Any, Dict, Optional


def call_typescript_project(input_text: str, env_file: str = ".env.local") -> Dict[str, Any]:
    """
    Call the TypeScript project with the given input and return the response.
    
    Args:
        input_text (str): The input text to process
        env_file (str): Path to the environment file to use (default: .env.local)
    
    Returns:
        Dict[str, Any]: The response from the TypeScript project
    
    Raises:
        subprocess.CalledProcessError: If the TypeScript process fails
        FileNotFoundError: If the environment file doesn't exist
        json.JSONDecodeError: If the response cannot be parsed as JSON
    """
    if not os.path.exists(env_file):
        raise FileNotFoundError(f"Environment file {env_file} not found")

    # Prepare the environment variables
    env = os.environ.copy()
    
    # Read the environment file
    with open(env_file, 'r') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                env[key] = value.strip('"').strip("'")

    try:
        # Call the TypeScript project using npm/tsx
        result = subprocess.run(
            ['npm', 'run', 'start'],
            input=input_text.encode(),
            capture_output=True,
            env=env,
            check=True
        )
        
        # Parse the output as JSON
        response = json.loads(result.stdout)
        return response
        
    except subprocess.CalledProcessError as e:
        print(f"Error running TypeScript project: {e}")
        print(f"stderr: {e.stderr.decode()}")
        raise
    except json.JSONDecodeError as e:
        print(f"Error parsing response: {e}")
        print(f"Raw output: {result.stdout.decode()}")
        raise 