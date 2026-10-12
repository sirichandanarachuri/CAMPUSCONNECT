import { useEffect, useState } from 'react';
import { getCompanyJobs, createCompanyJob, updateCompanyJob, deleteCompanyJob } from '../../services/companyService';

const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.detail) return typeof data.detail === 'string' ? data.detail : fallback;
  if (data && typeof data === 'object') {
    const messages = Object.values(data).flatMap((value) => Array.isArray(value) ? value : [value]).filter(Boolean);
    if (messages.length) return messages.join(' ');
  }
  return fallback;
};

const CompanyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    job_type: 'FULL_TIME',
    min_cgpa: 0,
    min_year: 1,
    max_year: 4,
    department: '',
    application_deadline: '',
  });

  const loadJobs = async () => {
    try {
      const response = await getCompanyJobs();
      setJobs(response.data || []);
    } catch (err) {
      setError('Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateCompanyJob(editingJob.id, form);
        setMessage('Job updated successfully.');
      } else {
        await createCompanyJob(form);
        setMessage('Job posted successfully.');
      }
      setForm({
        title: '', description: '', location: '', salary: '', job_type: 'FULL_TIME',
        min_cgpa: 0, min_year: 1, max_year: 4, department: '',
        application_deadline: '',
      });
      setShowForm(false);
      setEditingJob(null);
      await loadJobs();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save job.'));
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setForm(job);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteCompanyJob(id);
      setMessage('Job deleted successfully.');
      await loadJobs();
    } catch (err) {
      setError('Unable to delete job.');
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading jobs...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Jobs</h2>
        {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)}>Post New Job</button>}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {showForm && (
        <div className="card p-4 mb-4">
          <h4>{editingJob ? 'Edit Job' : 'Post New Job'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Job Title</label>
                <input
                  className="form-control" type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  className="form-control" type="text" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Salary</label>
                <input
                  className="form-control" type="text" value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Job Type</label>
                <select
                  className="form-select" value={form.job_type}
                  onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control" rows="4" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Min CGPA</label>
                <input
                  className="form-control" type="number" step="0.1" value={form.min_cgpa}
                  onChange={(e) => setForm({ ...form, min_cgpa: parseFloat(e.target.value) })}
                />
              </div>
              <div className="col-md-6 mb-3"><label className="form-label">Application Deadline</label><input className="form-control" type="datetime-local" value={form.application_deadline ? form.application_deadline.slice(0, 16) : ''} onChange={(e) => setForm({ ...form, application_deadline: e.target.value || null })} /></div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Min Year</label>
                <input
                  className="form-control" type="number" value={form.min_year}
                  onChange={(e) => setForm({ ...form, min_year: parseInt(e.target.value) })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Max Year</label>
                <input
                  className="form-control" type="number" value={form.max_year}
                  onChange={(e) => setForm({ ...form, max_year: parseInt(e.target.value) })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Department</label>
                <input
                  className="form-control" type="text" value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div className="col-12">
                <button className="btn btn-success" type="submit">Save Job</button>
                <button className="btn btn-secondary ms-2" type="button" onClick={() => {
                  setShowForm(false);
                  setEditingJob(null);
                  setForm({ title: '', description: '', location: '', salary: '', job_type: 'FULL_TIME', min_cgpa: 0, min_year: 1, max_year: 4, department: '', application_deadline: '' });
                }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="alert alert-info">No jobs posted yet. <button className="btn btn-link" onClick={() => setShowForm(true)}>Post your first job</button></div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div key={job.id} className="col-lg-6">
              <div className="card p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>{job.title}</h5>
                    <small className="text-muted">{job.location} • {job.job_type}</small>
                  </div>
                  <div className="btn-group" role="group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(job)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.id)}>Delete</button>
                  </div>
                </div>
                <p className="small mt-2 mb-0">{job.salary || 'Salary not specified'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobsPage;

