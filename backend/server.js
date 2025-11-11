const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

// 🔹 Thay YOUR_URI bằng connection string thật từ MongoDB Atlas
mongoose.connect('mongodb+srv://hieu:hieuvv123@cluster0.rwn2ano.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(3000, () => console.log('Server running on port 3000'));
