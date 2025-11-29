import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@erpv3.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/users');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
