import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(form);
      const accessToken = response.access;
      const refreshToken = response.refresh || null;
      const userData = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.role,
      };

      login({ accessToken, refreshToken, userData });

      if (response.role === 'STUDENT') navigate('/student/dashboard');
      else if (response.role === 'COMPANY') navigate('/company/dashboard');
      else if (response.role === 'PLACEMENT_OFFICER') navigate('/placement-officer/dashboard');
      else if (response.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || 'Login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-shell">
      <div className="card auth-card p-4">
        <h2 className="mb-3">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 mb-0 text-center">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

