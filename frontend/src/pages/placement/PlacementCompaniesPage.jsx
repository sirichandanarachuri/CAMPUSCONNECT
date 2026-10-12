import { useEffect, useState } from 'react';
import { getPlacementCompanies } from '../../services/placementService';

const PlacementCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await getPlacementCompanies();
        setCompanies(response.data || []);
      } catch (err) {
        setError('Unable to load companies.');
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading companies...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Companies</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {companies.length === 0 ? (
        <div className="alert alert-info">No companies registered yet.</div>
      ) : (
        <div className="row g-3">
          {companies.map((company) => (
            <div key={company.id} className="col-lg-6">
              <div className="card p-3">
                <h5>{company.company_name}</h5>
                <p className="small text-muted mb-1">
                  <strong>Industry:</strong> {company.industry || '-'}
                </p>
                <p className="small text-muted mb-1">
                  <strong>Location:</strong> {company.location || '-'}
                </p>
                <p className="small text-muted mb-0">
                  <strong>Contact:</strong> {company.contact_person || '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementCompaniesPage;

