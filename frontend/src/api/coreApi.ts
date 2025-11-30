import http from './httpClient';

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export const fetchUsers = () => http<UserItem[]>('/core/users');
