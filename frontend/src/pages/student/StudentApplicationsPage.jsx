import { useEffect, useState } from 'react';
import { getStudentApplications } from '../../services/studentService';

const StudentApplicationsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApps = async () => {
      try {
        const response = await getStudentApplications();
        setApps(response.data || []);
      } catch (err) {
        setError('Unable to load applications.');
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading applications...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2>My Applications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        {apps.length === 0 ? (
          <div className="col-12"><div className="alert alert-info">No applications submitted yet.</div></div>
        ) : (
          apps.map((item) => (
            <div key={item.id} className="col-lg-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>{item.job_detail?.title || 'Job'}</h4>
                    <p className="text-muted mb-1">{item.job_detail?.company || 'Company'}{item.job_detail?.location ? ` • ${item.job_detail.location}` : ''}</p>
                  </div>
                  <span className={`badge ${item.status === 'REJECTED' ? 'bg-danger' : item.status === 'SHORTLISTED' ? 'bg-warning text-dark' : item.status === 'SELECTED' ? 'bg-success' : 'bg-primary'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 mb-1"><strong>Applied:</strong> {new Date(item.applied_at).toLocaleString()}</p>
                <p><strong>Cover Letter:</strong> {item.cover_letter || 'Not provided'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplicationsPage;

