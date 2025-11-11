// src/components/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

const handleDelete = async (id) => {
await axios.delete(`http://localhost:3000/users/${id}`);
setUsers(users.filter(user => user.id !== id));
};

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
        <button onClick={() => handleEdit(user)}>Sửa</button>
        <button onClick={() => handleDelete(user.id)}>Xóa</button>
    </div>
  );
}
