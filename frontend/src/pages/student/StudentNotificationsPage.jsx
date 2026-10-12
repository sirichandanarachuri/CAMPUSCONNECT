import { useEffect, useState } from 'react';
import { getStudentNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/studentService';

const StudentNotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      const response = await getStudentNotifications();
      setItems(response.data || []);
    } catch (err) {
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      await loadNotifications();
    } catch (err) {
      setError('Unable to update notification status.');
    }
  };
  const handleMarkAllRead = async () => { try { await markAllNotificationsRead(); await loadNotifications(); } catch { setError('Unable to update notification status.'); } };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading notifications...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center"><h2>Notifications</h2>{items.some(item => !item.is_read) && <button className="btn btn-outline-primary btn-sm" onClick={handleMarkAllRead}>Mark all read</button>}</div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {items.length === 0 ? (
          <div className="alert alert-info">No notifications yet.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.title}</h5>
                  <p className="mb-1">{item.message}</p>
                  <small className="text-muted">{new Date(item.created_at).toLocaleString()}</small>
                </div>
                <div>
                  <span className={`badge me-2 ${item.is_read ? 'bg-secondary' : 'bg-primary'}`}>
                    {item.is_read ? 'Read' : 'Unread'}
                  </span>
                  {!item.is_read && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleMarkRead(item.id)}>Mark as read</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotificationsPage;

