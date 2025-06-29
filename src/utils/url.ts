/**
 * Utility functions for URL handling and validation
 */

/**
 * Checks if a URL is a publicly hosted Vercel URL
 * @param url - The URL to check
 * @returns true if the URL is a public hosted URL, false otherwise
 */
export function isPublicHostedUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check if it's a Vercel URL
    if (hostname.endsWith('.vercel.app')) {
      // Production URLs on Vercel typically don't have a long hash before the project name.
      // Preview URLs look like: `project-name-git-branch-hash-org.vercel.app` or `project-name-hash-org.vercel.app`
      // A more reliable check is to see if it's a production deployment,
      // but from the URL alone, we can check for the absence of the typical preview URL structure.
      // This is a heuristic and might not be foolproof.
      const parts = hostname.replace('.vercel.app', '').split('-');
      // If there are many hyphens, it's more likely a preview URL with git branch, hash, etc.
      // A simple production URL is often just `project-name.vercel.app`.
      // This logic remains a heuristic. A better approach is checking the deployment's 'target' property.
      // Given we only have the URL, we'll stick to a pattern match.
      // A less specific but more robust check is to assume if it's .vercel.app, it's public.
      // The distinction between "preview" and "production" is better handled by the VercelService.
      return true;
    }

    // Check if it's a custom domain (not vercel.app)
    if (!hostname.includes('vercel.app') && !hostname.includes('localhost')) {
      return true;
    }

    return false;
  } catch (error) {
    // Invalid URL
    return false;
  }
}


/**
 * Extracts the domain name from a URL
 * @param url - The URL to extract domain from
 * @returns the domain name or empty string if invalid
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
}

/**
 * Checks if a URL is a valid HTTP/HTTPS URL
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}