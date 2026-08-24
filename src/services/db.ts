import { getApiUrl } from '../config/api';

// Helper for fetch with auth header
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('azm_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'API request failed');
  }
  return response.json();
};

export const getCollection = async (collectionName: string) => {
  try {
    const data = await apiFetch(getApiUrl(`/${collectionName}`));
    // Handle paginated responses vs arrays
    return Array.isArray(data) ? data : (data.data || []);
  } catch (err) {
    console.error(`Error fetching collection ${collectionName}:`, err);
    return [];
  }
};

export const getDocument = async (collectionName: string, id: string) => {
  try {
    return await apiFetch(getApiUrl(`/${collectionName}?id=${id}`));
  } catch (err) {
    console.error(`Error fetching document ${id} from ${collectionName}:`, err);
    return null;
  }
};

export const createDocument = async (collectionName: string, data: any, id?: string) => {
  const payload = { ...data };
  if (id) payload.id = id;
  const res = await apiFetch(getApiUrl(`/${collectionName}`), {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res.id || id;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  await apiFetch(getApiUrl(`/${collectionName}?id=${id}`), {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteDocument = async (collectionName: string, id: string) => {
  await apiFetch(getApiUrl(`/${collectionName}?id=${id}`), {
    method: 'DELETE'
  });
};
