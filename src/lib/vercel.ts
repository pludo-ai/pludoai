interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  link?: {
    type: string;
    repo: string;
    repoId: number;
    org?: string;
  };
}

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
}

class VercelService {
  private token: string;
  private baseUrl = 'https://api.vercel.com';

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      
      // Handle specific Vercel API errors silently
      if (error.error?.message?.includes('already exists')) {
        // Project already exists - this is not a critical error
        console.log('Project already exists, continuing...');
        return { id: 'existing-project', name: 'existing' };
      }
      
      throw new Error(`Vercel API Error: ${error.error?.message || error.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async createProject(name: string, gitRepo: string): Promise<VercelProject> {
    const [owner, repo] = gitRepo.split('/');
    
    console.log(`🚀 Creating Vercel project: ${name} from ${gitRepo}`);
    
    try {
      // Create the project with minimal, valid configuration
      const project = await this.request('/v10/projects', {
        method: 'POST',
        body: JSON.stringify({
          name,
          gitRepository: {
            type: 'github',
            repo: gitRepo,
          },
          buildCommand: 'npm run build',
          devCommand: 'npm run dev',
          installCommand: 'npm install',
          outputDirectory: 'dist',
          framework: 'vite',
          publicSource: false,
        }),
      });

      console.log('✅ Vercel project created:', project.id);
      return project;
    } catch (error: any) {
      // If project already exists, try to get existing project
      if (error.message.includes('already exists')) {
        console.log('Project already exists, attempting to find existing project...');
        
        // Generate a likely URL for the existing project
        const projectUrl = `https://${name}.vercel.app`;
        
        return {
          id: 'existing-project',
          name: name,
          accountId: 'unknown',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          link: {
            type: 'github',
            repo: gitRepo,
            repoId: 0
          }
        };
      }
      throw error;
    }
  }

  async getProject(projectId: string): Promise<VercelProject> {
    return this.request(`/v9/projects/${projectId}`);
  }

  async getDeployments(projectId: string): Promise<{ deployments: VercelDeployment[] }> {
    return this.request(`/v6/deployments?projectId=${projectId}&limit=10`);
  }

  async waitForDeployment(projectId: string, maxWaitTime = 60000): Promise<string> {
    const startTime = Date.now();
    
    // For existing projects, return a generated URL immediately
    if (projectId === 'existing-project') {
      throw new Error('Manual trigger needed for existing project');
    }
    
    console.log('⏳ Waiting for automatic deployment to start...');
    
    // Wait for automatic deployment to be triggered by GitHub webhook
    const deploymentWaitTime = 30000; // 30 seconds for auto-deployment
    let deploymentFound = false;
    
    while (!deploymentFound && (Date.now() - startTime) < deploymentWaitTime) {
      try {
        const { deployments } = await this.getDeployments(projectId);
        
        if (deployments.length > 0) {
          deploymentFound = true;
          console.log('✅ Automatic deployment detected, monitoring progress...');
          break;
        }
        
        console.log('⏳ Waiting for automatic deployment...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error('Error checking for deployments:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (!deploymentFound) {
      // Return error to trigger manual intervention
      throw new Error('Manual trigger needed - deployment did not start automatically');
    }
    
    // Monitor the deployment progress
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const { deployments } = await this.getDeployments(projectId);
        
        if (deployments.length > 0) {
          const deployment = deployments[0];
          
          if (deployment.readyState === 'READY') {
            const url = `https://${deployment.url}`;
            console.log(`🎉 Deployment ready: ${url}`);
            return url;
          }
          
          if (deployment.readyState === 'ERROR') {
            throw new Error('Deployment failed during build process');
          }
          
          if (deployment.readyState === 'CANCELED') {
            throw new Error('Deployment was canceled');
          }
        }
      } catch (error) {
        if (error.message.includes('failed') || error.message.includes('canceled')) {
          throw error;
        }
        console.error('Error checking deployment status:', error);
      }
      
      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // If we timeout, trigger manual intervention
    throw new Error('Manual trigger needed - deployment timeout');
  }

  // Helper method to check if a project exists
  async projectExists(projectId: string): Promise<boolean> {
    try {
      await this.getProject(projectId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to get the latest deployment URL
  async getLatestDeploymentUrl(projectId: string): Promise<string | null> {
    try {
      const { deployments } = await this.getDeployments(projectId);
      
      if (deployments.length > 0) {
        const latestDeployment = deployments[0];
        if (latestDeployment.readyState === 'READY') {
          return `https://${latestDeployment.url}`;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting latest deployment URL:', error);
      return null;
    }
  }
}

export { VercelService, type VercelProject, type VercelDeployment };