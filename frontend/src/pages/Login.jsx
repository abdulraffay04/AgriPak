import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css'; // ✅ one css for auth

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.name);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.msg || err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form login" onSubmit={handleLogin}>
        <h2 className="brand-title">AgriPak</h2>
        <h3 className="form-title">Login</h3>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn-submit">Login</button>

        <p className="switch-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
