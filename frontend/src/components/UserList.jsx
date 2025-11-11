import React from 'react';
import axios from 'axios';

export default function UserList({ users, refreshUsers, setEditingUser }) {
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      await axios.delete(`http://localhost:3000/users/${id}`);
      refreshUsers();
    }
  };

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} - {u.email}
            <button onClick={() => setEditingUser(u)}>Sửa</button>
            <button onClick={() => handleDelete(u._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
