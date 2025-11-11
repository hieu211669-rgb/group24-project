// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
