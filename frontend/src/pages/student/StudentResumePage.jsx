import { useEffect, useState } from 'react';
import { getStudentResume, uploadStudentResume, updateStudentResume } from '../../services/studentService';

const StudentResumePage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadResume = async () => {
    try {
      const response = await getStudentResume();
      setResume(response.data[0] || null);
    } catch (err) {
      setError('Unable to load resume.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (resume) {
        await updateStudentResume(resume.id, file);
        setMessage('Resume updated successfully.');
      } else {
        await uploadStudentResume(file);
        setMessage('Resume uploaded successfully.');
      }
      await loadResume();
    } catch (err) {
      setError('Unable to upload resume.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading resume...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="card dashboard-card p-4">
        <h2>Resume</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {resume ? (
          <div className="mb-3">
            <p><strong>Current Resume:</strong> {resume.file_name || 'Uploaded'}</p>
            <a className="btn btn-outline-primary" href={`${apiBaseUrl}${resume.file}`} target="_blank" rel="noreferrer">Open Resume</a>
          </div>
        ) : (
          <p className="text-muted">No resume uploaded yet.</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Upload Resume</label>
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Uploading...' : resume ? 'Update Resume' : 'Upload Resume'}</button>
        </form>
      </div>
    </div>
  );
};

export default StudentResumePage;

