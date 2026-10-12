import { useEffect, useState } from 'react';
import { createCompanyProfile, getCompanyProfile, updateCompanyProfile } from '../../services/companyService';

const emptyProfile = { company_name: '', industry: '', website: '', company_email: '', description: '', location: '', contact_person: '', phone_number: '' };

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { getCompanyProfile().then(({ data }) => { const item = data[0] || null; setProfile(item); setForm(item || emptyProfile); }).catch(() => setError('Unable to load company profile.')); }, []);
  const save = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    try {
      const response = profile ? await updateCompanyProfile(profile.id, form) : await createCompanyProfile(form);
      setProfile(response.data); setForm(response.data); setMessage('Company profile saved.');
    } catch (err) { setError(Object.values(err?.response?.data || {}).flat().join(' ') || 'Unable to save company profile.'); }
  };
  return <div className="container py-5"><div className="card dashboard-card p-4"><h2>Company Profile</h2>{error && <div className="alert alert-danger">{error}</div>}{message && <div className="alert alert-success">{message}</div>}<form onSubmit={save}><div className="row g-3">
    {[['company_name','Company name'],['industry','Industry'],['company_email','Email'],['website','Website'],['location','Location'],['contact_person','Contact person'],['phone_number','Phone number']].map(([name,label]) => <div className="col-md-6" key={name}><label className="form-label">{label}</label><input className="form-control" type={name.includes('email') ? 'email' : name === 'website' ? 'url' : 'text'} value={form[name] || ''} onChange={e => setForm({...form,[name]:e.target.value})} required={name === 'company_name'} /></div>)}
    <div className="col-12"><label className="form-label">About the company</label><textarea className="form-control" rows="4" value={form.description || ''} onChange={e => setForm({...form,description:e.target.value})} /></div>
  </div><button className="btn btn-primary mt-4">Save Profile</button></form></div></div>;
}
