import { Link, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <header style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#f3f3f3' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/users">Users</Link>
          <Link to="/test-items">Test Items</Link>
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          {user ? (
            <span style={{ marginRight: '1rem' }}>Logged in as {user.email}</span>
          ) : (
            <span>Not logged in</span>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  );
};

export default Layout;
