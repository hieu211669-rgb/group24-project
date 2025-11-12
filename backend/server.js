require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URI}`)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Mongo Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(process.env.PORT, () => {
console.log(`🚀 Server running on port ${process.env.PORT}`);
});