import { useEffect, useState } from 'react';
import { getAdminJobs } from '../../services/adminService';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await getAdminJobs();
        setJobs(response.data || []);
      } catch (err) {
        setError('Unable to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading jobs...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Jobs</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {jobs.length === 0 ? (
        <div className="alert alert-info">No jobs posted.</div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div key={job.id} className="col-lg-6">
              <div className="card p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>{job.title}</h5>
                    <small className="text-muted">{job.company} • {job.location}</small>
                  </div>
                  <span className={`badge bg-${job.is_active ? 'success' : 'secondary'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
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

export default AdminJobsPage;

