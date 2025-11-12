// src/components/SignUp.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await API.post('/auth/signup', { name, email, password });
      setMsg('🎉 Đăng ký thành công!');
      setTimeout(() => navigate('/'), 1500); // tự chuyển sang login sau 1.5s
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Có lỗi xảy ra, thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Đăng ký</h2>
        <p style={styles.subtitle}>Tạo tài khoản mới để bắt đầu</p>

        <form onSubmit={handleSignUp} style={styles.form}>
          <input
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}

        <p style={styles.loginLink}>
          Đã có tài khoản? <Link to="/" style={styles.link}>Đăng nhập</Link>
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
  title: { fontSize: '22px', marginBottom: '10px', color: '#333' },
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
  msg: { marginTop: '15px', fontSize: '14px', color: '#333' },
  loginLink: { marginTop: '12px', fontSize: '14px', color: '#666' },
  link: { color: '#5563DE', textDecoration: 'none' },
};
