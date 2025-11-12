// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import API from '../api';

export default function Profile({ token, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const defaultAvatar = 'https://via.placeholder.com/100';

  // Lấy thông tin user khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
        setName(res.data.name);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [token]);

  // Upload avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await API.post('/profile/upload-avatar', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Cập nhật avatar ngay lập tức
      setUserData(prev => ({ ...prev, avatar: res.data.avatar }));
      alert('Avatar updated!');
    } catch (err) {
      console.log(err);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const res = await API.put('/profile', { name, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(prev => ({ ...prev, name }));
      setPassword('');
      alert('Profile updated!');
    } catch (err) {
      console.log(err);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await API.delete(`/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile deleted!');
      onLogout();
    } catch (err) {
      console.log(err);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      <img
        src={userData.avatar || defaultAvatar}
        alt="Avatar"
        style={styles.avatar}
      />
      <input type="file" onChange={handleAvatarUpload} />
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Role:</strong> {userData.role}
      </p>
      <input
        style={styles.input}
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="New Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleUpdateProfile}>
        Update Profile
      </button>
      <button style={styles.deleteBtn} onClick={handleDeleteProfile}>
        Delete Profile
      </button>
      <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
    </div>
  );
}

const styles = {
  container: { width: '350px', margin: 'auto', marginTop: '50px', textAlign: 'center' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' },
  input: { display: 'block', width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', margin: '5px 0', width: '100%' },
  deleteBtn: { padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', margin: '5px 0', width: '100%' },
  logoutBtn: { padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', margin: '5px 0', width: '100%' },
};
