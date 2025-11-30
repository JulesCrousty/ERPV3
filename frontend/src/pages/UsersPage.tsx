import { useEffect, useState } from 'react';
import { fetchUsers, UserItem } from '../api/coreApi';

const UsersPage = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || 'Failed to load users'));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
