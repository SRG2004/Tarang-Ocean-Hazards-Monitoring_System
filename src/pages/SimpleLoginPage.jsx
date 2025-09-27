import React, { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const roleLabels = {
  citizen: 'Citizen',
  official: 'Official',
  analyst: 'Analyst',
};

const roleBorders = {
  citizen: 'border-t-4 border-blue-400',
  official: 'border-t-4 border-green-400',
  analyst: 'border-t-4 border-purple-400',
};

export default function SimpleLoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { role } = useParams();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const roleLabel = roleLabels[role] || 'User';
  const accentClass = roleBorders[role] || '';

  return (
    <div className="min-h-screen bg-gradient-muted flex flex-col items-center justify-center px-4 py-8">
      <Link to="/" className="mb-4 text-sm text-slate-500 hover:text-blue-700 transition">
        &larr; Back to role selection
      </Link>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm p-8 ${accentClass}`}
        aria-label="Login form"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Login as {roleLabel}
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Username</span>
            <input
              type="text"
              required
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoFocus
              aria-label="Username"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Password"
            />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
