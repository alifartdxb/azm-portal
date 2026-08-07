export const API_CONFIG = {
  // Use import.meta.env for Vite or standard process.env based on your build tools
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const getApiUrl = (endpoint: string) => {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
};
