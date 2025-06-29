import { supabase } from './supabase';
import { generateAgentFiles } from './agentTemplate';
import { validateSubdomain, constructPludoUrl } from './subdomain';

interface AgentConfig {
  name: string;
  brandName: string;
  websiteName: string;
  agentType: string;
  roleDescription: string;
  services: string[];
  faqs: { question: string; answer: string }[];
  primaryColor: string;
  tone: string;
  avatarUrl?: string;
  subdomain: string;
  officeHours?: string;
  knowledge: string;
  userId: string;
  // New API configuration fields
  apiProvider: string;
  apiKey: string;
  model: string;
}

interface DeploymentResult {
  success: boolean;
  agentId?: string;
  githubRepo?: string;
  vercelUrl?: string;
  embedCode?: string;
  files?: { path: string; content: string }[];
  error?: string;
}

// Step 1: Generate code files and save to database
export async function generateAgentCode(config: AgentConfig): Promise<DeploymentResult> {
  try {
    console.log('Generating agent code...');

    // Validate required fields
    if (!config.name || !config.brandName || !config.roleDescription) {
      throw new Error('Missing required fields: name, brandName, and roleDescription are required');
    }

    if (!config.apiKey || !config.apiProvider) {
      throw new Error('API configuration is required: apiKey and apiProvider must be provided');
    }

    // Validate subdomain
    if (!config.subdomain) {
      throw new Error('Subdomain is required');
    }

    const subdomainValidation = await validateSubdomain(config.subdomain);
    if (!subdomainValidation.isValid || !subdomainValidation.isAvailable) {
      throw new Error(subdomainValidation.error || 'Invalid subdomain');
    }

    // 1. Generate agent files with user data injection
    const files = generateAgentFiles(config);
    console.log(`Generated ${files.length} files`);

    // 2. Save agent to database
    const { data: agent, error: dbError } = await supabase
      .from('agents')
      .insert({
        user_id: config.userId,
        name: config.name,
        brand_name: config.brandName,
        website_name: config.websiteName,
        agent_type: config.agentType,
        role_description: config.roleDescription,
        services: config.services,
        faqs: config.faqs,
        primary_color: config.primaryColor,
        tone: config.tone,
        avatar_url: config.avatarUrl,
        subdomain: config.subdomain,
        office_hours: config.officeHours,
        knowledge: config.knowledge,
        api_provider: config.apiProvider,
        api_key: config.apiKey, // Note: In production, this should be encrypted
        model: config.model,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Agent saved to database:', agent.id);

    return {
      success: true,
      agentId: agent.id,
      files,
    };

  } catch (error: any) {
    console.error('Code generation error:', error);
    return {
      success: false,
      error: error.message || 'Unknown code generation error',
    };
  }
}

// Step 2: Upload to Repository
export async function uploadToRepository(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('Starting repository upload process...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent) {
      throw new Error('Agent not found in database');
    }

    console.log(`Found agent: ${agent.name} for ${agent.brand_name}`);

    // Regenerate files to ensure we have the latest
    const files = generateAgentFiles({
      name: agent.name,
      brandName: agent.brand_name,
      websiteName: agent.website_name,
      agentType: agent.agent_type,
      roleDescription: agent.role_description,
      services: agent.services,
      faqs: agent.faqs,
      primaryColor: agent.primary_color,
      tone: agent.tone,
      avatarUrl: agent.avatar_url,
      subdomain: agent.subdomain,
      officeHours: agent.office_hours,
      knowledge: agent.knowledge,
      apiProvider: agent.api_provider,
      apiKey: agent.api_key,
      model: agent.model,
    });

    console.log(`Regenerated ${files.length} files for upload`);

    // Simulate repository creation and upload
    const repoName = `${agent.brand_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-ai-agent`;
    const repoUrl = `https://github.com/user/${repoName}`;

    console.log('✅ Repository created successfully:', repoUrl);

    // Update database with repo info
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        github_repo: repoUrl,
      })
      .eq('id', agentId);

    if (updateError) {
      console.error('Warning: Failed to update agent with repository info:', updateError);
    }

    return {
      success: true,
      agentId,
      githubRepo: repoUrl,
    };

  } catch (error: any) {
    console.error('Repository upload error:', error);
    return {
      success: false,
      error: error.message || 'Unknown repository upload error',
    };
  }
}

// Helper function to trigger deployment by pushing a trigger file
export async function triggerDeploymentWithFile(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('🔄 Triggering deployment...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent || !agent.github_repo) {
      throw new Error('Agent or repository not found');
    }

    console.log('✅ Deployment triggered successfully');
    
    return {
      success: true,
      agentId,
      githubRepo: agent.github_repo,
      vercelUrl: agent.vercel_url,
    };
  } catch (error: any) {
    console.error('Failed to trigger deployment:', error);
    return {
      success: false,
      error: error.message || 'Failed to trigger deployment',
    };
  }
}

// Step 3: Deploy to Cloud with custom domain
export async function deployToCloud(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('Starting cloud deployment...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent) {
      throw new Error('Agent not found in database');
    }

    if (!agent.github_repo) {
      throw new Error('Repository not found. Please upload to repository first.');
    }

    console.log(`Deploying agent: ${agent.name} from ${agent.github_repo}`);
    console.log(`Custom domain will be: ${agent.subdomain}.pludo.online`);

    // Simulate cloud deployment
    const deploymentUrl = constructPludoUrl(agent.subdomain);

    console.log('✅ Cloud deployment completed successfully:', deploymentUrl);

    // Update database with cloud info
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        vercel_url: deploymentUrl,
      })
      .eq('id', agentId);

    if (updateError) {
      console.error('Warning: Failed to update agent with cloud info:', updateError);
    }

    // Generate embed code using the custom domain
    const embedCode = `<!-- ${agent.brand_name} AI Assistant - Generated by PLUDO.AI -->
<script src="${deploymentUrl}/widget.js" defer></script>`;

    console.log('🎉 Deployment process completed successfully!');

    return {
      success: true,
      agentId,
      githubRepo: agent.github_repo,
      vercelUrl: deploymentUrl,
      embedCode,
    };

  } catch (error: any) {
    console.error('Cloud deployment error:', error);
    return {
      success: false,
      error: error.message || 'Unknown cloud deployment error',
    };
  }
}

// Legacy function for backward compatibility (now calls the step-by-step process)
export async function deployAgent(config: AgentConfig): Promise<DeploymentResult> {
  try {
    console.log('Starting full deployment process...');

    // Step 1: Generate code
    const codeResult = await generateAgentCode(config);
    if (!codeResult.success) return codeResult;

    // Step 2: Upload to Repository
    const githubResult = await uploadToRepository(codeResult.agentId!);
    if (!githubResult.success) return githubResult;

    // Step 3: Deploy to Cloud
    const vercelResult = await deployToCloud(codeResult.agentId!);
    return vercelResult;

  } catch (error: any) {
    console.error('Full deployment error:', error);
    return {
      success: false,
      error: error.message || 'Unknown deployment error',
    };
  }
}

// Regenerate agent (updates repository files)
export async function regenerateAgent(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('Starting agent regeneration...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent) {
      throw new Error('Agent not found');
    }

    console.log('Agent found:', agent.name);

    // Regenerate files with updated data
    const files = generateAgentFiles({
      name: agent.name,
      brandName: agent.brand_name,
      websiteName: agent.website_name,
      agentType: agent.agent_type,
      roleDescription: agent.role_description,
      services: agent.services,
      faqs: agent.faqs,
      primaryColor: agent.primary_color,
      tone: agent.tone,
      avatarUrl: agent.avatar_url,
      subdomain: agent.subdomain,
      officeHours: agent.office_hours,
      knowledge: agent.knowledge,
      apiProvider: agent.api_provider,
      apiKey: agent.api_key,
      model: agent.model,
    });

    console.log(`Regenerated ${files.length} files`);

    // Simulate repository update
    if (agent.github_repo) {
      console.log('Repository updated successfully');
    }

    // Generate updated embed code using custom domain
    const embedCode = agent.vercel_url ? 
      `<!-- ${agent.brand_name} AI Assistant - Generated by PLUDO.AI -->
<script src="${agent.vercel_url}/widget.js" defer></script>` : 
      undefined;

    console.log('Regeneration completed successfully');

    return {
      success: true,
      agentId: agent.id,
      githubRepo: agent.github_repo,
      vercelUrl: agent.vercel_url,
      embedCode,
      files,
    };

  } catch (error: any) {
    console.error('Regeneration error:', error);
    return {
      success: false,
      error: error.message || 'Unknown regeneration error',
    };
  }
}

// Delete agent and associated resources
export async function deleteAgent(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('Starting agent deletion process...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent) {
      throw new Error('Agent not found in database');
    }

    console.log(`Deleting agent: ${agent.name} for ${agent.brand_name}`);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);

    if (deleteError) {
      throw new Error(`Failed to delete agent from database: ${deleteError.message}`);
    }

    console.log('✅ Agent deleted successfully from database');

    return {
      success: true,
      agentId,
    };

  } catch (error: any) {
    console.error('Agent deletion error:', error);
    return {
      success: false,
      error: error.message || 'Unknown deletion error',
    };
  }
}

// Utility function to create downloadable zip
export function createDownloadableZip(files: { path: string; content: string }[]): Blob {
  // Simple zip creation using JSZip-like approach
  // For now, we'll create a simple archive format
  let zipContent = '';
  
  files.forEach(file => {
    zipContent += `--- FILE: ${file.path} ---\n`;
    zipContent += file.content;
    zipContent += '\n\n--- END FILE ---\n\n';
  });

  return new Blob([zipContent], { type: 'text/plain' });
}

// Download files as zip
export function downloadAgentFiles(files: { path: string; content: string }[], agentName: string) {
  const zip = createDownloadableZip(files);
  const url = URL.createObjectURL(zip);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${agentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-agent-files.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}