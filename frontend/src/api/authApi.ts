import http from './httpClient';

export interface LoginResponse {
  accessToken: string;
  user: any;
}

export const login = (email: string, password: string) =>
  http<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const me = () => http<any>('/auth/me');
