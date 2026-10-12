import { useEffect, useState } from 'react';
import { getStudentInterviews } from '../../services/studentService';

const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const response = await getStudentInterviews();
        setInterviews(response.data || []);
      } catch (err) {
        setError('Unable to load interviews.');
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading interviews...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2>Scheduled Interviews</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        {interviews.length === 0 ? (
          <div className="col-12"><div className="alert alert-info">No interviews scheduled.</div></div>
        ) : (
          interviews.map((item) => (
            <div key={item.id} className="col-lg-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h4>{item.job_detail?.title || 'Interview'}</h4>
                  <span className={`badge ${item.status === 'SCHEDULED' ? 'bg-primary' : 'bg-secondary'}`}>{item.status}</span>
                </div>
                <p className="mb-2"><strong>Company:</strong> {item.company_name || 'Company'}</p>
                <p className="mb-2"><strong>Date & Time:</strong> {new Date(item.scheduled_at).toLocaleString()}</p>
                <p className="mb-2"><strong>Location:</strong> {item.location || 'Virtual'}</p>
                <p className="mb-2"><strong>Mode:</strong> {item.mode}</p>
                {item.meeting_link && <p className="mb-2"><strong>Meeting Link:</strong> <a href={item.meeting_link} target="_blank" rel="noreferrer">Join</a></p>}
                {item.notes && <p className="mb-0"><strong>Notes:</strong> {item.notes}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentInterviewsPage;

