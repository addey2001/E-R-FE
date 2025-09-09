import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInSignUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignIn) {
        // Sign in
        const res = await fetch('http://127.0.0.1:8000/users/sign-in/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password })
        });
        if (!res.ok) throw new Error('Invalid credentials');
        const data = await res.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        window.dispatchEvent(new Event('auth:changed'));
        navigate('/');
      } else {
        // Sign up
        const res = await fetch('http://127.0.0.1:8000/users/sign-up/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password, email: form.email })
        });
        if (!res.ok) throw new Error('Sign up failed');
        setIsSignIn(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {!isSignIn && (
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        )}
        <button type="submit" style={{ marginTop: 12 }}>{isSignIn ? 'Sign In' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsSignIn(s => !s)} style={{ marginTop: 12, background: 'none', color: '#007bff', border: 'none', cursor: 'pointer' }}>
        {isSignIn ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}
