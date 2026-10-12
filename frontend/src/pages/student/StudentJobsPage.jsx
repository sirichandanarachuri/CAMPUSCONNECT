import { useEffect, useState } from 'react';
import { getEligibleJobs, createStudentApplication } from '../../services/studentService';

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

const StudentJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadJobs = async () => {
    try {
      const response = await getEligibleJobs();
      setJobs(response.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load available jobs.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleApply = async (jobId) => {
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await createStudentApplication({ job: jobId, cover_letter: coverLetter });
      setMessage('Application submitted successfully.');
      setSelectedJob(null);
      setCoverLetter('');
      await loadJobs();
    } catch (err) {
      const messages = err?.response?.data;
      const errorText = messages ? Object.values(messages).flat().join(' ') : 'Unable to apply for this job.';
      setError(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading jobs...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2>Eligible Jobs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        {jobs.length === 0 ? (
          <div className="col-12"><div className="alert alert-info">No eligible jobs available right now.</div></div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="col-lg-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4>{job.title}</h4>
                    <p className="text-muted mb-2">{job.company}</p>
                  </div>
                  <span className="badge bg-primary">{job.job_type}</span>
                </div>
                <p>{job.description}</p>
                <div className="small text-muted mb-2">
                  <div>Location: {job.location}</div>
                  <div>Salary: {job.salary || 'Not specified'}</div>
                  <div>Min CGPA: {job.min_cgpa}</div>
                  <div>Department: {job.department || 'All'}</div>
                  {job.application_deadline && <div>Apply by: {new Date(job.application_deadline).toLocaleString()}</div>}
                </div>
                <button className="btn btn-primary" onClick={() => setSelectedJob(job)}>
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedJob.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedJob(null)} />
              </div>
              <div className="modal-body">
                <p><strong>Company:</strong> {selectedJob.company}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Salary:</strong> {selectedJob.salary || 'Not specified'}</p>
                {selectedJob.application_deadline && <p><strong>Apply by:</strong> {new Date(selectedJob.application_deadline).toLocaleString()}</p>}
                <p>{selectedJob.description}</p>
                <label className="form-label">Cover letter <span className="text-muted">(optional)</span></label>
                <textarea className="form-control" rows="4" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Tell the company why you are a good fit." />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => handleApply(selectedJob.id)} disabled={submitting}>
                  {submitting ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentJobsPage;

