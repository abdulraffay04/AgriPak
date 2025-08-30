import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css'; // ✅ one css for auth

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role });
      alert(res.data.msg || 'Registered successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || err.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form signup" onSubmit={handleSignup}>
        <h2 className="brand-title">AgriPak</h2>
        <h3 className="form-title">Signup</h3>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

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

        <button type="submit" className="btn-submit">Sign Up</button>

        <p className="switch-text">
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
