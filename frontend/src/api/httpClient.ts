const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}

export default http;
