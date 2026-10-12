import { useEffect, useState } from 'react';
import { getCompanyInterviews, updateCompanyInterview } from '../../services/companyService';

const CompanyInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadInterviews = async () => {
    try {
      const response = await getCompanyInterviews();
      setInterviews(response.data || []);
    } catch (err) {
      setError('Unable to load interviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const cancelInterview = async (interview) => {
    try { await updateCompanyInterview(interview.id, { ...interview, status: 'CANCELLED' }); await loadInterviews(); setMessage('Interview cancelled and candidate returned to shortlisted.'); }
    catch { setError('Unable to cancel interview.'); }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading interviews...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Scheduled Interviews</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {interviews.length === 0 ? (
        <div className="alert alert-info">No interviews scheduled yet.</div>
      ) : (
        <div className="row g-3">
          {interviews.map((interview) => (
            <div key={interview.id} className="col-lg-6">
              <div className="card p-3">
                <h5>{interview.student_detail?.full_name || 'Candidate'}</h5>
                <p className="small text-muted mb-2">Position: {interview.student_detail?.job_title || interview.job}</p>
                <p className="small mb-1">
                  <strong>Date:</strong> {new Date(interview.scheduled_at).toLocaleDateString()}
                </p>
                <p className="small mb-1">
                  <strong>Round:</strong> {interview.interview_round || 'Not specified'}
                </p>
                <p className="small mb-1">
                  <strong>Location:</strong> {interview.location || 'Online'}
                </p>
                <span className={`badge bg-${interview.status === 'SCHEDULED' ? 'primary' : interview.status === 'COMPLETED' ? 'success' : 'secondary'}`}>
                  {interview.status}
                </span>
                {interview.status === 'SCHEDULED' && <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => cancelInterview(interview)}>Cancel interview</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInterviewsPage;

