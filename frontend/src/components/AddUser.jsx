import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddUser({ refreshUsers, editingUser, setEditingUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Khi click "Sửa", hiển thị dữ liệu người đó trong form
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      // PUT
      await axios.put(`http://localhost:3000/users/${editingUser._id}`, { name, email });
      setEditingUser(null);
    } else {
      // POST
      await axios.post('http://localhost:3000/users', { name, email });
    }
    setName('');
    setEmail('');
    refreshUsers();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingUser ? 'Cập nhật User' : 'Thêm User mới'}</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">{editingUser ? 'Cập nhật' : 'Thêm'}</button>
    </form>
  );
}
