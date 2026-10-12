import { useEffect, useState } from 'react';
import { getStudentSkills, createStudentSkill, updateStudentSkill, deleteStudentSkill } from '../../services/studentService';

const defaultForm = {
  name: '',
  level: 'BEGINNER',
};

const StudentSkillsPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadSkills = async () => {
    try {
      const response = await getStudentSkills();
      setItems(response.data || []);
    } catch (err) {
      setError('Unable to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
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
        await updateStudentSkill(editingId, form);
        setMessage('Skill updated successfully.');
      } else {
        await createStudentSkill(form);
        setMessage('Skill added successfully.');
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadSkills();
    } catch (err) {
      setError('Unable to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, level: item.level });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudentSkill(id);
      setMessage('Skill removed successfully.');
      await loadSkills();
    } catch (err) {
      setError('Unable to delete skill.');
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading skills...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card dashboard-card p-4">
            <h3>{editingId ? 'Edit Skill' : 'Add Skill'}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Skill</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Level</label>
                <select className="form-select" name="level" value={form.level} onChange={handleChange}>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
              {editingId && <button className="btn btn-outline-secondary ms-2" type="button" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Cancel</button>}
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card dashboard-card p-4">
            <h3>My Skills</h3>
            {items.length === 0 ? <p className="text-muted">No skills yet.</p> : (
              <div className="list-group">
                {items.map((item) => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-muted">{item.level}</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
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

export default StudentSkillsPage;

