import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');
        setUsers(res.data);
      } catch (err) {
        navigate('/');
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa user này?')) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <h2>Danh sách người dùng</h2>
      <button onClick={handleLogout}>Đăng xuất</button>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Tên</th><th>Email</th><th>Role</th><th>Thao tác</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><button onClick={() => handleDelete(u._id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
