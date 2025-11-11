import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddUser({ refreshUsers, editingUser, setEditingUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validation
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      if (editingUser) {
        // PUT: cập nhật user
        await axios.put(`http://localhost:3000/users/${editingUser._id}`, { name, email });
        setEditingUser(null);
      } else {
        // POST: thêm user mới
        await axios.post('http://localhost:3000/users', { name, email });
      }
      setName('');
      setEmail('');
      refreshUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingUser ? 'Cập nhật User' : 'Thêm User'}</h3>
      <input
        type="text"
        value={name}
        placeholder="Tên"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">{editingUser ? 'Cập nhật' : 'Thêm'}</button>
    </form>
  );
}
