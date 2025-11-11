// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function AddUser({ refreshUsers }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/users', { name, email });
    setName('');
    setEmail('');
    refreshUsers();
  };

  return (
    <form onSubmit={handleAdd}>
      <h3>Thêm User</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Thêm</button>
    </form>
  );
}
