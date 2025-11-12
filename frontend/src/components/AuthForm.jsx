import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        const role = res.data.user.role;

        if (role === 'admin') navigate('/admin');
        else navigate('/profile');
      } else {
        const res = await API.post('/auth/signup', { name, email, password });
        setMsg(res.data.msg);
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
        </form>
        <p>{msg}</p>
        <button className="toggle-btn" onClick={toggleForm}>
          {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
}
