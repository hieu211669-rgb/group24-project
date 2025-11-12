// src/components/ResetPassword.jsx
import { useState } from 'react';
import API from '../api';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMsg(res.data.msg);
      setTimeout(() => navigate('/'), 2000); // tự động chuyển về login sau 2s
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Reset Password</h2>
        <p style={styles.subtitle}>Nhập mật khẩu mới của bạn</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Reset Password'}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}

        <p style={styles.links}>
          <Link to="/" style={styles.link}>← Quay lại Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #74ABE2, #5563DE)',
  },
  card: {
    width: '350px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    padding: '30px 25px',
    textAlign: 'center',
  },
  title: { fontSize: '22px', marginBottom: '8px', color: '#333' },
  subtitle: { fontSize: '14px', marginBottom: '20px', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#5563DE',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  msg: { marginTop: '15px', fontSize: '14px', color: 'red' },
  links: { marginTop: '12px', fontSize: '14px', color: '#666' },
  link: { color: '#5563DE', textDecoration: 'none' },
};
