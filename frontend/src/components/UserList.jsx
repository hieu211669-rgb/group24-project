// src/components/UserList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function UserList({ token, onLogout }) {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [editingUser, setEditingUser] = useState(null); // user đang edit
  const defaultAvatar = 'https://via.placeholder.com/100';
  const navigate = useNavigate();

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

  // Xóa user
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

  // Cập nhật user (name, email, role)
  const handleUpdateUser = async () => {
    try {
      const res = await API.put(`/users/user/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Nếu backend trả về accessToken mới, cập nhật localStorage
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
      }

      // Cập nhật UI
      setUserList(userList.map(u => 
        u._id === editingUser._id ? res.data.user : u
      ));
      setMsg('User updated successfully!');
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || 'Error updating user');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!userList.length) return <div style={styles.noUsers}>Không có user nào</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Admin Dashboard</h2>
        <div>
          <button
            style={styles.logBtn}
            onClick={() => navigate('/logs')}
          >
            Xem logs
          </button>
          <button
            style={styles.logoutBtn}
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn đăng xuất?')) onLogout();
            }}
          >
            Đăng xuất
          </button>
        </div>
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
                  <img src={u.avatar || defaultAvatar} alt={`${u.name} avatar`} style={styles.avatar} />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => setEditingUser({ ...u })}
                  >
                    Sửa
                  </button>
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

      {/* Popup Edit User */}
      {editingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Sửa thông tin User</h3>

            <input
              style={styles.input}
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Name"
            />

            <input
              style={styles.input}
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
            />

            <select
              style={styles.select}
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <button style={styles.saveBtn} onClick={handleUpdateUser}>
              Lưu thay đổi
            </button>
            <button style={styles.closeBtn} onClick={() => setEditingUser(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: '95%', maxWidth: '950px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  logoutBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', marginLeft: '8px' },
  logBtn: { background: '#007bff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  msg: { color: 'green', textAlign: 'center' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  row: { borderBottom: '1px solid #ddd' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' },
  editBtn: { background: '#007bff', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '5px' },
  deleteBtn: { background: '#ff4d4f', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modal: { background: '#fff', padding: '20px', borderRadius: '12px', width: '350px', textAlign: 'center' },
  input: { width: '100%', padding: '8px', marginTop: '10px', border: '1px solid #ccc', borderRadius: '6px' },
  select: { width: '100%', padding: '8px', marginTop: '10px', borderRadius: '6px' },
  saveBtn: { marginTop: '15px', width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  closeBtn: { marginTop: '8px', width: '100%', padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { textAlign: 'center', marginTop: '50px' },
  noUsers: { textAlign: 'center', marginTop: '50px' },
};
