interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
}

interface GitHubFile {
  path: string;
  content: string;
  encoding?: 'base64' | 'utf-8';
}

class GitHubService {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  private utf8ToBase64(str: string): string {
    // Convert UTF-8 string to base64 safely
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      // Fallback for complex characters
      const encoder = new TextEncoder();
      const bytes = encoder.encode(str);
      let binaryString = '';
      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      return btoa(binaryString);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PLUDO-AI-Agent-Generator',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
        
        // Add more specific error details if available
        if (errorJson.errors && Array.isArray(errorJson.errors)) {
          const errorDetails = errorJson.errors.map((err: any) => err.message || err.code).join(', ');
          errorMessage += ` (${errorDetails})`;
        }
      } catch (e) {
        // If response is not JSON, use the text as error message
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(`GitHub API Error: ${errorMessage}`);
    }

    return response.json();
  }

  async createRepo(name: string, description: string): Promise<GitHubRepo> {
    // Ensure repository name is valid
    const validName = name.toLowerCase()
      .replace(/[^a-z0-9\-_.]/g, '-')
      .replace(/^[-_.]+|[-_.]+$/g, '')
      .replace(/[-_.]{2,}/g, '-')
      .substring(0, 100); // GitHub limit

    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name: validName,
        description: description.substring(0, 350), // GitHub limit
        private: true,
        auto_init: true, // Initialize with README to avoid empty repo issues
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        allow_squash_merge: true,
        allow_merge_commit: true,
        allow_rebase_merge: true,
        delete_branch_on_merge: true,
      }),
    });
  }

  async uploadFiles(repoFullName: string, files: GitHubFile[], commitMessage: string) {
    console.log(`Starting upload of ${files.length} files to ${repoFullName}`);
    
    try {
      // First, verify we can access the repository
      console.log('Verifying repository access...');
      const repo = await this.request(`/repos/${repoFullName}`);
      console.log('✅ Repository access verified:', repo.name);

      // Wait for repository to be fully ready
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get the default branch and current commit
      let defaultBranch = 'main';
      let parentCommitSha = null;
      let baseTreeSha = null;
      
      try {
        console.log('Checking for main branch...');
        const ref = await this.request(`/repos/${repoFullName}/git/ref/heads/main`);
        parentCommitSha = ref.object.sha;
        
        // Get the tree for the current commit
        const commit = await this.request(`/repos/${repoFullName}/git/commits/${parentCommitSha}`);
        baseTreeSha = commit.tree.sha;
        console.log(`✅ Found main branch with commit: ${parentCommitSha}`);
      } catch (error) {
        // If main doesn't exist, try master
        try {
          console.log('Main branch not found, checking for master branch...');
          const ref = await this.request(`/repos/${repoFullName}/git/ref/heads/master`);
          defaultBranch = 'master';
          parentCommitSha = ref.object.sha;
          
          const commit = await this.request(`/repos/${repoFullName}/git/commits/${parentCommitSha}`);
          baseTreeSha = commit.tree.sha;
          console.log(`✅ Found master branch with commit: ${parentCommitSha}`);
        } catch (masterError) {
          console.log('No existing branches found, creating initial commit...');
          
          // Create initial commit if no branches exist
          const initialBlob = await this.request(`/repos/${repoFullName}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({
              content: this.utf8ToBase64('# Initial commit\n\nThis repository was created by PLUDO.AI'),
              encoding: 'base64',
            }),
          });

          const initialTree = await this.request(`/repos/${repoFullName}/git/trees`, {
            method: 'POST',
            body: JSON.stringify({
              tree: [{
                path: 'README.md',
                mode: '100644',
                type: 'blob',
                sha: initialBlob.sha
              }]
            }),
          });

          const initialCommit = await this.request(`/repos/${repoFullName}/git/commits`, {
            method: 'POST',
            body: JSON.stringify({
              message: 'Initial commit',
              tree: initialTree.sha,
              parents: []
            }),
          });

          // Create main branch
          await this.request(`/repos/${repoFullName}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({
              ref: 'refs/heads/main',
              sha: initialCommit.sha
            }),
          });

          parentCommitSha = initialCommit.sha;
          baseTreeSha = initialTree.sha;
          defaultBranch = 'main';
          console.log('✅ Created initial commit and main branch');
        }
      }

      // Create blobs for all files
      console.log('Creating blobs for files...');
      const blobs = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Creating blob for ${file.path} (${i + 1}/${files.length})`);
        
        try {
          // Ensure content is properly encoded
          const content = file.encoding === 'base64' ? file.content : this.utf8ToBase64(file.content);
          
          const blob = await this.request(`/repos/${repoFullName}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({
              content: content,
              encoding: 'base64',
            }),
          });
          
          blobs.push({ 
            path: file.path, 
            sha: blob.sha,
            mode: '100644',
            type: 'blob'
          });
          
          console.log(`✓ Created blob for ${file.path} (SHA: ${blob.sha.substring(0, 8)}...)`);
          
          // Small delay between blob creations to avoid rate limiting
          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`✗ Failed to create blob for ${file.path}:`, error);
          throw new Error(`Failed to create blob for ${file.path}: ${error.message}`);
        }
      }

      console.log(`Successfully created ${blobs.length} blobs`);

      // Create a new tree with all the files
      console.log('Creating tree...');
      const treeData = {
        tree: blobs,
        base_tree: baseTreeSha // Use the existing tree as base
      };

      const tree = await this.request(`/repos/${repoFullName}/git/trees`, {
        method: 'POST',
        body: JSON.stringify(treeData),
      });

      console.log(`✓ Created tree: ${tree.sha}`);

      // Create a new commit
      console.log('Creating commit...');
      const commitData = {
        message: commitMessage,
        tree: tree.sha,
        parents: [parentCommitSha] // Reference the parent commit
      };

      const commit = await this.request(`/repos/${repoFullName}/git/commits`, {
        method: 'POST',
        body: JSON.stringify(commitData),
      });

      console.log(`✓ Created commit: ${commit.sha}`);

      // Update the branch reference
      console.log(`Updating ${defaultBranch} branch reference...`);
      
      await this.request(`/repos/${repoFullName}/git/refs/heads/${defaultBranch}`, {
        method: 'PATCH',
        body: JSON.stringify({
          sha: commit.sha,
          force: false
        }),
      });

      console.log(`✓ Updated ${defaultBranch} branch reference`);
      console.log(`🎉 Successfully uploaded all files to ${repoFullName}`);

      return commit.sha;

    } catch (error) {
      console.error('GitHub upload failed:', error);
      
      // Provide more specific error messages
      if (error.message.includes('401')) {
        throw new Error('GitHub authentication failed. The token may be invalid, expired, or lack proper permissions. Please ensure the token has "repo" scope.');
      } else if (error.message.includes('403')) {
        throw new Error('GitHub access forbidden. This could be due to rate limiting or insufficient permissions. Please try again later.');
      } else if (error.message.includes('404')) {
        throw new Error('Repository not found. It may have been deleted or you may not have access to it.');
      } else if (error.message.includes('422')) {
        throw new Error('Repository validation failed. Please check if the repository name is valid and you have proper permissions.');
      } else if (error.message.includes('409')) {
        throw new Error('Repository conflict detected. The repository may already exist or there may be a naming conflict.');
      }
      
      throw error;
    }
  }

  // Helper method to validate repository name
  validateRepoName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\-_.]/g, '-')
      .replace(/^[-_.]+|[-_.]+$/g, '')
      .replace(/[-_.]{2,}/g, '-')
      .substring(0, 100);
  }

  // Helper method to check if repository exists
  async repositoryExists(repoFullName: string): Promise<boolean> {
    try {
      await this.request(`/repos/${repoFullName}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to get repository contents
  async getRepositoryContents(repoFullName: string, path: string = ''): Promise<any[]> {
    try {
      return await this.request(`/repos/${repoFullName}/contents/${path}`);
    } catch (error) {
      return [];
    }
  }

  // Helper method to verify token permissions
  async verifyTokenPermissions(): Promise<{ valid: boolean; scopes: string[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'PLUDO-AI-Agent-Generator',
        },
      });

      if (!response.ok) {
        return {
          valid: false,
          scopes: [],
          error: `Token validation failed: ${response.status} ${response.statusText}`
        };
      }

      const scopes = response.headers.get('X-OAuth-Scopes')?.split(', ') || [];
      
      return {
        valid: true,
        scopes,
      };
    } catch (error) {
      return {
        valid: false,
        scopes: [],
        error: error.message
      };
    }
  }
}

export { GitHubService, type GitHubRepo, type GitHubFile };