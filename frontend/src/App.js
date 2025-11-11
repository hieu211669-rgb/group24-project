// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <AddUser refreshUsers={fetchUsers} />
      <UserList users={users} />
    </div>
  );
}

export default App;
