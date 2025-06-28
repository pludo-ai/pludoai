import { supabase } from './supabase';
import { GitHubService } from './github';
import { VercelService } from './vercel';
import { generateAgentFiles } from './agentTemplate';

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

// Updated tokens with proper repo permissions - using classic token format
const GITHUB_TOKEN = 'ghp_vQZhGJKLMNOPQRSTUVWXYZ1234567890abcdef'; // This needs to be a valid token
const VERCEL_TOKEN = 'E2PTFvHYm6hMqtsHJn6TSlWW';

// Helper function to generate unique repo name
function generateRepoName(brandName: string, userId: string): string {
  const cleanBrandName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
  const userSuffix = userId.slice(-4);
  const randomSuffix = Math.random().toString(36).substr(2, 4);
  const timestamp = Date.now().toString().slice(-6);
  return `${cleanBrandName}-ai-agent-${userSuffix}-${randomSuffix}-${timestamp}`;
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
export async function uploadToGitHub(agentId: string): Promise<DeploymentResult> {
  try {
    console.log('Starting repository upload process...');

    // Validate token
    if (!GITHUB_TOKEN || GITHUB_TOKEN.length < 20) {
      throw new Error('Invalid repository token. Please ensure the token is properly configured with repo permissions.');
    }

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
      officeHours: agent.office_hours,
      knowledge: agent.knowledge,
      apiProvider: agent.api_provider,
      apiKey: agent.api_key,
      model: agent.model,
    });

    console.log(`Regenerated ${files.length} files for upload`);

    // Create service instance
    const github = new GitHubService(GITHUB_TOKEN);
    
    // Generate unique repository name
    const repoName = generateRepoName(agent.brand_name, agent.user_id);
    console.log('Creating repository:', repoName);
    
    try {
      // Create repository with clean description (no control characters)
      const description = `AI Assistant for ${agent.brand_name} - Generated by PLUDO.AI. A complete, deployable AI chatbot with intelligent conversation capabilities, custom branding, and mobile-responsive design. Tech Stack: React + TypeScript + Vite + Tailwind CSS. Ready for cloud deployment.`;
      
      const repo = await github.createRepo(repoName, description);

      console.log('✅ Repository created successfully:', repo.html_url);

      // Wait for repository to be fully initialized
      console.log('Waiting for repository initialization...');
      await new Promise(resolve => setTimeout(resolve, 8000)); // Increased wait time

      // Prepare commit message
      const commitMessage = `🚀 Initial deployment: ${agent.name} AI Agent

✨ Features:
- Intelligent AI-powered conversations using ${agent.api_provider}
- Custom branding with ${agent.tone} personality
- ${agent.services.length} services configured
- ${agent.faqs.length} FAQs ready
- Mobile-responsive design with Framer Motion
- Floating chat widget for easy integration

🛠️ Tech Stack:
- React 18 + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- ${agent.api_provider === 'openrouter' ? 'OpenRouter' : 'Google Gemini'} AI for conversations
- Vite for fast development
- Cloud-ready deployment configuration

📦 Files included:
${files.map(f => `- ${f.path}`).join('\n')}

Generated by PLUDO.AI on ${new Date().toISOString()}`;

      // Upload files to repository
      console.log('Uploading files to repository...');
      await github.uploadFiles(
        repo.full_name,
        files.map(file => ({
          path: file.path,
          content: file.content,
        })),
        commitMessage
      );

      console.log('✅ All files uploaded successfully to repository');

      // Update database with repo info
      const { error: updateError } = await supabase
        .from('agents')
        .update({
          github_repo: repo.html_url,
        })
        .eq('id', agentId);

      if (updateError) {
        console.error('Warning: Failed to update agent with repository info:', updateError);
        // Don't throw error here as the main operation succeeded
      }

      return {
        success: true,
        agentId,
        githubRepo: repo.html_url,
      };

    } catch (githubError: any) {
      console.error('Repository operation failed:', githubError);
      
      // Enhanced error handling for API errors
      let errorMessage = githubError.message || 'Unknown repository error';
      
      if (errorMessage.includes('422') || errorMessage.includes('Unprocessable')) {
        errorMessage = 'Repository creation failed. This could be due to:\n• Repository name already exists\n• Invalid repository configuration\n• Token lacks required permissions\n\nPlease ensure your token has "repo" scope permissions.';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Repository authentication failed. Please check that your Personal Access Token is valid and not expired.';
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        errorMessage = 'Repository access forbidden. This could be due to:\n• API rate limit exceeded\n• Insufficient token permissions\n• Organization restrictions\n\nPlease try again later or check your token permissions.';
      } else if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
        errorMessage = 'Repository conflict. A repository with this name may already exist. Please try again to generate a new unique name.';
      }
      
      throw new Error(errorMessage);
    }

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
    console.log('🔄 Triggering deployment by pushing trigger.txt...');

    // Get agent from database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (fetchError || !agent || !agent.github_repo) {
      throw new Error('Agent or repository not found');
    }

    // Extract repo name from URL
    const repoFullName = agent.github_repo.replace('https://github.com/', '').replace('.git', '');
    
    // Create service instance
    const github = new GitHubService(GITHUB_TOKEN);
    
    // Create trigger file content
    const triggerContent = `# Deployment Trigger

This file was created to trigger a new deployment.

Agent: ${agent.name}
Brand: ${agent.brand_name}
Triggered at: ${new Date().toISOString()}
Trigger ID: ${Math.random().toString(36).substr(2, 9)}

This file can be safely deleted after deployment completes.
`;

    // Upload trigger file
    await github.uploadFiles(
      repoFullName,
      [{
        path: 'trigger.txt',
        content: triggerContent,
      }],
      `🚀 Trigger deployment for ${agent.name} - ${new Date().toISOString()}`
    );

    console.log('✅ Trigger file pushed successfully');
    
    return {
      success: true,
      agentId,
      githubRepo: agent.github_repo,
      vercelUrl: agent.vercel_url,
    };
  } catch (error: any) {
    console.error('Failed to push trigger file:', error);
    return {
      success: false,
      error: error.message || 'Failed to trigger deployment',
    };
  }
}

// Step 3: Deploy to Cloud
export async function deployToVercel(agentId: string): Promise<DeploymentResult> {
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

    // Extract repo name from URL
    const repoFullName = agent.github_repo.replace('https://github.com/', '').replace('.git', '');
    const repoName = repoFullName.split('/')[1];

    console.log(`Repository details: ${repoFullName}`);

    // Deploy to cloud
    console.log('Creating cloud project...');
    const vercel = new VercelService(VERCEL_TOKEN);
    const project = await vercel.createProject(repoName, repoFullName);
    
    console.log('✅ Cloud project created:', project.id);

    // Wait for deployment to complete with better error handling
    console.log('Waiting for cloud deployment to complete...');
    let vercelUrl;
    
    try {
      // Start monitoring for deployment with shorter timeout
      vercelUrl = await vercel.waitForDeployment(project.id, 120000); // 2 minutes
      console.log('✅ Deployment completed successfully:', vercelUrl);
    } catch (deploymentError: any) {
      console.error('Initial deployment wait failed:', deploymentError);
      
      // Return partial success with project info for manual trigger
      const dashboardUrl = `https://vercel.com/dashboard/projects/${project.id}`;
      
      // Update database with partial info
      const { error: updateError } = await supabase
        .from('agents')
        .update({
          vercel_url: dashboardUrl,
        })
        .eq('id', agentId);

      return {
        success: false,
        agentId,
        githubRepo: agent.github_repo,
        vercelUrl: dashboardUrl,
        error: `Project created successfully but deployment is pending. You can trigger it manually or wait for automatic deployment.`,
      };
    }

    // Update database with cloud info
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        vercel_url: vercelUrl,
      })
      .eq('id', agentId);

    if (updateError) {
      console.error('Warning: Failed to update agent with cloud info:', updateError);
      // Don't throw error here as the main operation succeeded
    }

    // Generate embed code
    const embedCode = `<!-- ${agent.brand_name} AI Assistant - Generated by PLUDO.AI -->
<script src="${vercelUrl}/widget.js" defer></script>`;

    console.log('🎉 Deployment process completed successfully!');

    return {
      success: true,
      agentId,
      githubRepo: agent.github_repo,
      vercelUrl,
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
    const githubResult = await uploadToGitHub(codeResult.agentId!);
    if (!githubResult.success) return githubResult;

    // Step 3: Deploy to Cloud
    const vercelResult = await deployToVercel(codeResult.agentId!);
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
      officeHours: agent.office_hours,
      knowledge: agent.knowledge,
      apiProvider: agent.api_provider,
      apiKey: agent.api_key,
      model: agent.model,
    });

    console.log(`Regenerated ${files.length} files`);

    // Update repository if it exists
    if (agent.github_repo) {
      const github = new GitHubService(GITHUB_TOKEN);
      const repoFullName = agent.github_repo.replace('https://github.com/', '').replace('.git', '');
      
      console.log('Updating repository:', repoFullName);
      
      const commitMessage = `🔄 Agent regeneration update: ${agent.name}

Updated configuration:
- Knowledge base refreshed
- UI components updated  
- Latest AI prompts applied
- All files synchronized

Configuration details:
- Services: ${agent.services.length} configured
- FAQs: ${agent.faqs.length} ready
- Tone: ${agent.tone}
- Primary color: ${agent.primary_color}
- API Provider: ${agent.api_provider}
- Model: ${agent.model}

Regenerated by PLUDO.AI on ${new Date().toISOString()}`;

      await github.uploadFiles(
        repoFullName,
        files.map(file => ({
          path: file.path,
          content: file.content,
        })),
        commitMessage
      );

      console.log('Repository updated successfully');
    }

    // Generate updated embed code
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

    // Delete repository if it exists
    if (agent.github_repo) {
      try {
        const repoFullName = agent.github_repo.replace('https://github.com/', '').replace('.git', '');
        
        console.log('Deleting repository:', repoFullName);
        
        const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (response.ok) {
          console.log('✅ Repository deleted successfully');
        } else {
          console.error('Failed to delete repository:', response.status, response.statusText);
          // Continue with database deletion even if repository deletion fails
        }
      } catch (githubError) {
        console.error('Warning: Failed to delete repository:', githubError);
        // Continue with database deletion even if repository deletion fails
      }
    }

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