import { useEffect, useState } from 'react';
import { getStudentEducation, createStudentEducation, updateStudentEducation, deleteStudentEducation } from '../../services/studentService';

const defaultForm = {
  institution_name: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  grade: '',
  description: '',
};

const StudentEducationPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const response = await getStudentEducation();
      setItems(response.data || []);
    } catch (err) {
      setError('Unable to load education records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      if (editingId) {
        await updateStudentEducation(editingId, form);
        setMessage('Education updated successfully.');
      } else {
        await createStudentEducation(form);
        setMessage('Education added successfully.');
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError('Unable to save education record.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudentEducation(id);
      setMessage('Education removed successfully.');
      await loadData();
    } catch (err) {
      setError('Unable to delete education record.');
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading education...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card dashboard-card p-4">
            <h3>{editingId ? 'Edit Education' : 'Add Education'}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Institution Name</label><input className="form-control" name="institution_name" value={form.institution_name} onChange={handleChange} required /></div>
              <div className="mb-3"><label className="form-label">Degree</label><input className="form-control" name="degree" value={form.degree} onChange={handleChange} required /></div>
              <div className="mb-3"><label className="form-label">Field of Study</label><input className="form-control" name="field_of_study" value={form.field_of_study} onChange={handleChange} required /></div>
              <div className="row">
                <div className="col-md-6"><label className="form-label">Start Date</label><input className="form-control" type="date" name="start_date" value={form.start_date} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">End Date</label><input className="form-control" type="date" name="end_date" value={form.end_date} onChange={handleChange} /></div>
              </div>
              <div className="mb-3 mt-3"><label className="form-label">Grade</label><input className="form-control" name="grade" value={form.grade} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="3" /></div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
              {editingId && <button className="btn btn-outline-secondary ms-2" type="button" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Cancel</button>}
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card dashboard-card p-4">
            <h3>Education History</h3>
            {items.length === 0 ? <p className="text-muted">No education records yet.</p> : (
              <div className="list-group">
                {items.map((item) => (
                  <div key={item.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5>{item.institution_name}</h5>
                        <p className="mb-1"><strong>{item.degree}</strong> in {item.field_of_study}</p>
                        <small className="text-muted">{item.start_date} - {item.end_date || 'Present'}</small>
                        {item.grade && <div><small>Grade: {item.grade}</small></div>}
                        {item.description && <div className="mt-2">{item.description}</div>}
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEducationPage;

