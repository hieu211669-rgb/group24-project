import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setUser(res.data);
        setName(res.data.name);
      } catch (err) {
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/profile', { name });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="profile-container">
      <h2>Xin chào, {user.name}</h2>
      <p>Email: {user.email}</p>

      <form onSubmit={handleUpdate}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Cập nhật tên</button>
      </form>
      <p>{msg}</p>

      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}
