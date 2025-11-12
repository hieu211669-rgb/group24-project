// src/components/UserList.jsx
import { useState, useEffect } from 'react';
import API from '../api';

export default function UserList({ token, onLogout }) {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserList(res.data);
      } catch (err) {
        console.error(err);
        setMsg(err.response?.data?.msg || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(userList.filter(u => u._id !== id));
      setMsg('User deleted successfully');
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || 'Error deleting user');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!userList.length) return <div style={styles.noUsers}>Không có user nào</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Admin Dashboard</h2>
        <button
          style={styles.logoutBtn}
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn đăng xuất?')) onLogout();
          }}
        >
          Đăng xuất
        </button>
      </div>

      {msg && <p style={styles.msg}>{msg}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map(u => (
              <tr key={u._id} style={styles.row}>
                <td>
                  <img
                    src={u.avatar || '/default-avatar.png'}
                    alt="avatar"
                    style={styles.avatar}
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(u._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '95%',
    maxWidth: '900px',
    margin: '40px auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  msg: { color: 'green', marginBottom: '10px', textAlign: 'center' },
  tableWrapper: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  row: {
    borderBottom: '1px solid #ddd',
    transition: 'background 0.2s',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  loading: { textAlign: 'center', marginTop: '50px', fontSize: '16px', color: '#555' },
  noUsers: { textAlign: 'center', marginTop: '50px', fontSize: '16px', color: '#555' },
};
