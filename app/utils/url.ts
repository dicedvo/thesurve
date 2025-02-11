export const isSSR = () => import.meta.env.SSR || typeof window === 'undefined';

export function buildUrl(path?: string, baseUrl?: string): string {
  // If no path provided and we're in browser, return current URL
  if (!path) {
    // If we're not in SSR, return empty string
    if (isSSR()) {
      return '';
    }

    return window.location.href;
  }

  // Determine base URL based on environment
  let finalBaseUrl = baseUrl;

  if (!finalBaseUrl) {
    if (isSSR()) {
      finalBaseUrl = process.env.VITE_BASE_URL || '';
    } else {
      finalBaseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    }
  }

  // If finalBaseUrl is empty, throw an error
  if (!finalBaseUrl) {
    throw new Error('Should not happen: base URL is empty');
  }

  try {
    const base = new URL(finalBaseUrl);
    if (!path) return base.toString();
    return new URL(path, base).toString();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('Invalid URL: ' + e.message);
    } else {
      throw new Error('Invalid URL: ' + e);
    }
  }
}
