import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(form);
      // Log the response shape for debugging (do NOT log actual tokens)
      try {
        const keys = response && typeof response === 'object' ? Object.keys(response) : typeof response;
        console.debug('[register] response keys/type:', keys);
      } catch (e) {}
      navigate('/login');
    } catch (err) {
      const messages = err?.response?.data;
      const errorMessage = messages ? Object.values(messages).flat().join(' ') : 'Registration failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-shell">
      <div className="card auth-card p-4">
        <h2 className="mb-3">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Password</label>
              <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                <option value="STUDENT">Student</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input className="form-control" name="phone_number" value={form.phone_number} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary w-100 mt-4" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-3 mb-0 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

