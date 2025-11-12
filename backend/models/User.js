const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true, default: 'user'},
    avatar: { type: String,default: 'http://localhost:3000/uploads/default-avatar.png'}
});


module.exports = mongoose.model('User', userSchema);