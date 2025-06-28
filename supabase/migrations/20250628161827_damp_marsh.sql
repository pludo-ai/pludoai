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