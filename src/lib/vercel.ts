import { URL } from 'url';

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
  target?: 'production' | 'staging';
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
      throw new Error(`Vercel API Error: ${error.error?.message || error.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async createProject(name: string, gitRepo: string): Promise<VercelProject> {
    const [owner, repo] = gitRepo.split('/');

    console.log(`🚀 Creating Vercel project: ${name} from ${gitRepo}`);

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

    // Wait for the project to be fully set up and GitHub integration to be established
    console.log('⏳ Waiting for GitHub integration to be established...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Check if the project has been linked to GitHub
    let linkedProject = null;
    let attempts = 0;
    const maxAttempts = 6;

    while (attempts < maxAttempts) {
      try {
        linkedProject = await this.getProject(project.id);
        if (linkedProject.link?.repoId) {
          console.log('✅ GitHub integration established with repoId:', linkedProject.link.repoId);
          break;
        }
        console.log(`⏳ Waiting for GitHub integration... (attempt ${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        attempts++;
      } catch (error) {
        console.log('⚠️ Error checking project link:', error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    return linkedProject || project;
  }

  async getProject(projectId: string): Promise<VercelProject> {
    return this.request(`/v9/projects/${projectId}`);
  }

  async getDeployments(projectId: string): Promise<{ deployments: VercelDeployment[] }> {
    return this.request(`/v6/deployments?projectId=${projectId}&limit=10`);
  }

  async waitForDeployment(projectId: string, maxWaitTime = 120000): Promise<string> {
    const startTime = Date.now();
    let lastState = '';
    let deploymentFound = false;

    console.log('⏳ Waiting for automatic deployment to start...');

    // Wait for automatic deployment to be triggered by GitHub webhook
    const deploymentWaitTime = 90000; // 1.5 minutes for auto-deployment
    while (!deploymentFound && (Date.now() - startTime) < deploymentWaitTime) {
      try {
        const { deployments } = await this.getDeployments(projectId);

        if (deployments.length > 0) {
          deploymentFound = true;
          console.log('✅ Automatic deployment detected, monitoring progress...');
          break;
        }

        console.log('⏳ Waiting for automatic deployment...');
        await new Promise(resolve => setTimeout(resolve, 15000)); // Check every 15 seconds
      } catch (error: any) {
        console.error('Error checking for deployments:', error);
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }

    if (!deploymentFound) {
      // Return error to trigger manual intervention
      const project = await this.getProject(projectId);
      const projectUrl = `https://vercel.com/dashboard/projects/${project.id}`;

      throw new Error(`Automatic deployment did not start within 1.5 minutes. Manual trigger may be needed. Dashboard: ${projectUrl}`);
    }

    // Monitor the deployment progress
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const { deployments } = await this.getDeployments(projectId);

        if (deployments.length > 0) {
          const deployment = deployments[0];

          if (deployment.readyState !== lastState) {
            console.log(`📊 Deployment state: ${deployment.readyState}`);
            lastState = deployment.readyState;
          }

          if (deployment.readyState === 'READY') {
            // Try to get the production URL instead of preview URL
            const productionUrl = await this.getProductionUrl(projectId);
            const publicUrl = productionUrl || `https://${deployment.url}`;
            console.log(`🎉 Deployment ready: ${publicUrl}`);
            return publicUrl;
          }

          if (deployment.readyState === 'ERROR') {
            // Get project URL for manual intervention
            const project = await this.getProject(projectId);
            const projectUrl = `https://vercel.com/dashboard/projects/${project.id}`;
            throw new Error(`Deployment failed. Please check the build logs at ${projectUrl} for more details.`);
          }

          if (deployment.readyState === 'CANCELED') {
            throw new Error(`Deployment was canceled. Please try again or check your Vercel dashboard.`);
          }
        } else {
          console.log('⏳ No deployments found, waiting...');
        }
      } catch (error: any) {
        if (error.message.includes('Deployment failed')) {
          throw error; // Re-throw deployment failures
        }
        console.error('Error checking deployment status:', error);
      }

      // Wait 15 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 15000));
    }

    // If we timeout, provide the project URL for manual intervention
    const project = await this.getProject(projectId);
    const projectUrl = `https://vercel.com/dashboard/projects/${project.id}`;
    throw new Error(`Deployment timeout after ${maxWaitTime / 1000} seconds. Please visit ${projectUrl} to check the deployment status and manually trigger if needed.`);
  }

  // Helper method to trigger a production deployment
  async triggerProductionDeployment(projectId: string): Promise<void> {
    try {
      console.log('🚀 Triggering production deployment to main branch...');

      // Trigger a deployment to the main branch
      await this.request('/v13/deployments', {
        method: 'POST',
        body: JSON.stringify({
          name: 'production',
          projectId: projectId,
          target: 'production',
          gitSource: {
            type: 'github',
            ref: 'main',
            sha: 'HEAD'
          }
        }),
      });

      console.log('✅ Production deployment triggered successfully');
    } catch (error: any) {
      console.error('Error triggering production deployment:', error);
      // Don't throw error, just log it
    }
  }

  // Helper method to get production URL
  async getProductionUrl(projectId: string): Promise<string | null> {
    try {
      const { deployments } = await this.getDeployments(projectId);

      // Look for a production deployment
      for (const deployment of deployments) {
        if (deployment.readyState === 'READY' && deployment.target === 'production') {
          const url = `https://${deployment.url}`;
          console.log('✅ Found production URL:', url);
          return url;
        }
      }

      // If no production URL found, try to trigger a production deployment
      console.log('⚠️ No production URL found, attempting to trigger production deployment...');
      await this.triggerProductionDeployment(projectId);

      // Wait a bit and check again
      await new Promise(resolve => setTimeout(resolve, 30000));

      const { deployments: newDeployments } = await this.getDeployments(projectId);
      for (const deployment of newDeployments) {
        if (deployment.readyState === 'READY' && deployment.target === 'production') {
          const url = `https://${deployment.url}`;
          console.log('✅ Found production URL after trigger:', url);
          return url;
        }
      }

      console.log('⚠️ Still no production URL found, using latest ready deployment URL as a fallback.');
      const latestReadyDeployment = newDeployments.find(d => d.readyState === 'READY');
      if (latestReadyDeployment) {
        return `https://${latestReadyDeployment.url}`;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting production URL:', error);
      return null;
    }
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
      return await this.getProductionUrl(projectId);
    } catch (error: any) {
      console.error('Error getting latest deployment URL:', error);
      return null;
    }
  }

  // Helper method to get deployment logs
  async getDeploymentLogs(deploymentId: string): Promise<any> {
    try {
      return await this.request(`/v2/deployments/${deploymentId}/events`);
    } catch (error) {
      console.error('Error getting deployment logs:', error);
      return null;
    }
  }
}

export { VercelService, type VercelProject, type VercelDeployment };