import http from './httpClient';

export interface TestItem {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export const fetchTestItems = () => http<TestItem[]>('/test/items');

export const createTestItem = (data: { name: string; description?: string; isActive: boolean }) =>
  http<TestItem>('/test/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
