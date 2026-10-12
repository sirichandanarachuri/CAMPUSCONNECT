import { useEffect, useState } from 'react';
import { createCompanyInterview, getCompanyApplications, shortlistApplication, rejectApplication, selectApplication } from '../../services/companyService';

const CompanyApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [interviewFor, setInterviewFor] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ scheduled_at: '', interview_round: '', mode: 'ONLINE', location: '', meeting_link: '', notes: '' });

  const loadApplications = async () => {
    try {
      const response = await getCompanyApplications();
      setApplications(response.data || []);
    } catch (err) {
      setError('Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleShortlist = async (id) => {
    try {
      await shortlistApplication(id);
      setMessage('Candidate shortlisted.');
      await loadApplications();
    } catch (err) {
      setError('Unable to shortlist candidate.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplication(id);
      setMessage('Application rejected.');
      await loadApplications();
    } catch (err) {
      setError('Unable to reject application.');
    }
  };

  const scheduleInterview = async (event) => {
    event.preventDefault();
    try {
      await createCompanyInterview({ ...interviewForm, application: interviewFor.id });
      setMessage('Interview scheduled and candidate moved to interview stage.'); setInterviewFor(null); await loadApplications();
    } catch (err) { setError(Object.values(err?.response?.data || {}).flat().join(' ') || 'Unable to schedule interview.'); }
  };

  const handleSelect = async (id) => { try { await selectApplication(id); setMessage('Candidate marked as selected.'); await loadApplications(); } catch (err) { setError(err?.response?.data?.detail || 'Unable to select candidate.'); } };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading applicants...</div></div>;
  }

  const filteredApps = filter ? applications.filter((a) => a.status === filter) : applications;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Applicants</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
          <option value="INTERVIEW">Interview</option>
          <option value="SELECTED">Selected</option>
        </select>
      </div>

      {filteredApps.length === 0 ? (
        <div className="alert alert-info">No applications found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.student.full_name}</strong><br/>
                    <small className="text-muted">{app.student.email}</small>
                  </td>
                  <td>{app.student.department || '-'}</td>
                  <td>{app.student.cgpa || '-'}</td>
                  <td>
                    <span className={`badge bg-${app.status === 'APPLIED' ? 'primary' : app.status === 'SHORTLISTED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td><small>{new Date(app.applied_at).toLocaleDateString()}</small></td>
                  <td>
                    {app.status === 'APPLIED' && (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => handleShortlist(app.id)}>Shortlist</button>
                        <button className="btn btn-sm btn-danger ms-1" onClick={() => handleReject(app.id)}>Reject</button>
                      </>
                    )}
                    {app.status === 'SHORTLISTED' && <button className="btn btn-sm btn-primary" onClick={() => setInterviewFor(app)}>Schedule interview</button>}
                    {app.status === 'INTERVIEW' && <button className="btn btn-sm btn-success" onClick={() => handleSelect(app.id)}>Mark selected</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {interviewFor && <div className="modal fade show d-block" style={{background:'rgba(15,23,42,.55)'}}><div className="modal-dialog"><form className="modal-content" onSubmit={scheduleInterview}><div className="modal-header"><h5>Schedule: {interviewFor.student.full_name}</h5><button type="button" className="btn-close" onClick={() => setInterviewFor(null)} /></div><div className="modal-body"><div className="row g-3"><div className="col-12"><label className="form-label">Date and time</label><input className="form-control" type="datetime-local" required value={interviewForm.scheduled_at} onChange={e => setInterviewForm({...interviewForm,scheduled_at:e.target.value})}/></div><div className="col-md-6"><label className="form-label">Round</label><input className="form-control" value={interviewForm.interview_round} onChange={e => setInterviewForm({...interviewForm,interview_round:e.target.value})}/></div><div className="col-md-6"><label className="form-label">Mode</label><select className="form-select" value={interviewForm.mode} onChange={e => setInterviewForm({...interviewForm,mode:e.target.value})}><option value="ONLINE">Online</option><option value="ONSITE">On-site</option></select></div><div className="col-12"><label className="form-label">Location / meeting link</label><input className="form-control mb-2" placeholder="Location" value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm,location:e.target.value})}/><input className="form-control" type="url" placeholder="https://..." value={interviewForm.meeting_link} onChange={e => setInterviewForm({...interviewForm,meeting_link:e.target.value})}/></div><div className="col-12"><textarea className="form-control" placeholder="Notes" value={interviewForm.notes} onChange={e => setInterviewForm({...interviewForm,notes:e.target.value})}/></div></div></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setInterviewFor(null)}>Cancel</button><button className="btn btn-primary">Schedule</button></div></form></div></div>}
    </div>
  );
};

export default CompanyApplicantsPage;

