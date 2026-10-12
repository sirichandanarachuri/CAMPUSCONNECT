import { useEffect, useState } from 'react';
import { getAdminStudents } from '../../services/adminService';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getAdminStudents();
        setStudents(response.data || []);
      } catch (err) {
        setError('Unable to load students.');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading students...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Students</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {students.length === 0 ? (
        <div className="alert alert-info">No students registered.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>CGPA</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.full_name}</strong></td>
                  <td>{student.department || '-'}</td>
                  <td>{student.year_of_study || '-'}</td>
                  <td>{student.cgpa || '-'}</td>
                  <td><small>{student.user?.email || '-'}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;

