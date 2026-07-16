const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  target: {
    target_kalori_harian: { type: Number, default: 2000 },
    target_minum_gelas: { type: Number, default: 8 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);