import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './components/AddUser';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <AddUser
        refreshUsers={fetchUsers}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
      <UserList
        users={users}
        refreshUsers={fetchUsers}
        setEditingUser={setEditingUser}
      />
    </div>
  );
}

export default App;
