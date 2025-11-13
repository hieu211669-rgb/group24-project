import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/users/logs'); // gọi backend /api/users/logs
        setLogs(res.data);
      } catch (err) {
        console.error('Fetch logs error:', err);
        setError(err.response?.data?.msg || 'Lỗi tải logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>📜 User Activity Logs</h2>

      {logs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Không có log nào.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>User</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Action</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Time</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{log.userId?.name || log.userId || 'N/A'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>{log.action}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: log.status === 'OK' ? 'green' : 'red' }}>{log.status || 'OK'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
