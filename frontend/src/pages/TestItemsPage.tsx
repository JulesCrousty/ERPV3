import { useEffect, useState } from 'react';
import { createTestItem, fetchTestItems, TestItem } from '../api/testApi';

const TestItemsPage = () => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    fetchTestItems()
      .then(setItems)
      .catch((err) => setError(err.message || 'Failed to load items'));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createTestItem({ name, description, isActive });
      setName('');
      setDescription('');
      setIsActive(true);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    }
  };

  return (
    <div>
      <h2>Test Items</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <label>
          Active
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </label>
        <button type="submit">Create</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description || 'No description'} ({item.isActive ? 'Active' : 'Inactive'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestItemsPage;
