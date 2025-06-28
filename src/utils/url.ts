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
      // Exclude preview/branch deployments (they typically have git branch names)
      // Production deployments usually have shorter, cleaner names
      const subdomain = hostname.replace('.vercel.app', '');
      
      // If it contains hyphens followed by random characters, it's likely a preview
      // Production URLs are typically shorter and cleaner
      const previewPattern = /-[a-z0-9]{8,}-[a-z0-9]+$/i;
      return !previewPattern.test(subdomain);
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