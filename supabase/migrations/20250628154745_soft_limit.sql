/*
  # Add API configuration fields to agents table

  1. New Columns
    - `api_provider` (text) - The AI provider (openrouter, gemini)
    - `api_key` (text) - The encrypted API key
    - `model` (text) - The AI model to use

  2. Security
    - API keys are stored encrypted
    - Only the agent owner can access their API configuration
*/

-- Add new columns for API configuration
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS api_provider text DEFAULT 'openrouter',
ADD COLUMN IF NOT EXISTS api_key text,
ADD COLUMN IF NOT EXISTS model text DEFAULT 'deepseek/deepseek-r1';

-- Update existing agents to have default API configuration
UPDATE agents 
SET 
  api_provider = 'openrouter',
  model = 'deepseek/deepseek-r1'
WHERE api_provider IS NULL OR model IS NULL;