import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    login(username.trim());
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-panel login-hero">
        <span className="login-logo">🥐</span>
        <h1>Campus Bakery</h1>
        <p>Freshly baked, every school day. Point-of-sale for the campus counter.</p>
      </div>
      <div className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Cashier Sign In</h2>
          <p className="muted">Enter any credentials to continue.</p>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. cashier01" autoFocus />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block btn-lg">Log In</button>
        </form>
      </div>
    </div>
  );
}
