// src/components/ForgotPassword.jsx
import { useState } from 'react';
import API from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMsg(res.data.msg || 'Email đặt lại mật khẩu đã được gửi!');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔒 Quên mật khẩu</h2>
        <p style={styles.subtitle}>
          Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi liên kết'}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

// 💅 CSS-in-JS style đẹp mắt
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    marginBottom: '10px',
    color: '#333',
    fontSize: '22px',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#5563DE',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background 0.3s',
  },
  msg: {
    marginTop: '15px',
    color: '#333',
    fontSize: '14px',
  },
};
