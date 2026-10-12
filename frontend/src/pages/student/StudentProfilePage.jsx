import { useEffect, useState } from 'react';
import { getStudentProfile, createStudentProfile, updateStudentProfile } from '../../services/studentService';

const defaultForm = {
  full_name: '',
  department: '',
  year_of_study: 1,
  graduation_year: 2027,
  cgpa: '',
  bio: '',
  city: '',
  address: '',
  portfolio_url: '',
  linkedin_url: '',
  github_url: '',
};

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getStudentProfile();
        const data = response.data[0] || null;
        setProfile(data);
        if (data) setForm({ ...data });
      } catch (err) {
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (profile) {
        await updateStudentProfile(profile.id, form);
        setMessage('Profile updated successfully.');
      } else {
        const response = await createStudentProfile(form);
        setProfile(response.data);
        setMessage('Profile created successfully.');
      }
    } catch (err) {
      const messages = err?.response?.data;
      const errorText = messages ? Object.values(messages).flat().join(' ') : 'Unable to save profile.';
      setError(errorText);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading profile...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="card dashboard-card p-4">
        <h2>{profile ? 'Update Profile' : 'Create Profile'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Full Name</label><input className="form-control" name="full_name" value={form.full_name} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label">Department</label><input className="form-control" name="department" value={form.department} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">Year of Study</label><input className="form-control" type="number" name="year_of_study" value={form.year_of_study} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">Graduation Year</label><input className="form-control" type="number" name="graduation_year" value={form.graduation_year} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">CGPA</label><input className="form-control" type="number" step="0.01" name="cgpa" value={form.cgpa} onChange={handleChange} /></div>
            <div className="col-md-12"><label className="form-label">Bio</label><textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} rows="4" /></div>
            <div className="col-md-6"><label className="form-label">City</label><input className="form-control" name="city" value={form.city} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">Address</label><input className="form-control" name="address" value={form.address} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">Portfolio URL</label><input className="form-control" name="portfolio_url" value={form.portfolio_url} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">LinkedIn</label><input className="form-control" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} /></div>
            <div className="col-md-4"><label className="form-label">GitHub</label><input className="form-control" name="github_url" value={form.github_url} onChange={handleChange} /></div>
          </div>
          <button className="btn btn-primary mt-4" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;

