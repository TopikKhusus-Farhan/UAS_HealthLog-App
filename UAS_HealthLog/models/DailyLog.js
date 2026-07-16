const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tanggal: { type: String, required: true },
  
  // Ringkasan Aktivitas Fisik & Nutrisi
  total_kalori_masuk: { type: Number, default: 0 },
  total_kalori_keluar: { type: Number, default: 0 },
  total_minum_gelas: { type: Number, default: 0 }, 

  //Log Istirahat / Tidur
  durasi_tidur_jam: { type: Number, default: 0 },
  kualitas_tidur: { 
    type: String, 
    enum: ['Buruk', 'Cukup', 'Baik', 'Sangat Baik'], 
    default: 'Baik' 
  },

  // Array untuk menyimpan daftar makanan hari itu
  aktivitas_makan: [{
    waktu: { type: String, enum: ['Sarapan', 'Makan Siang', 'Makan Malam', 'Camilan'] },
    nama_makanan: { type: String, required: true },
    kalori: { type: Number, required: true }
  }],

  // Array untuk menyimpan daftar olahraga hari itu
  aktivitas_olahraga: [{
    jenis: { type: String, required: true },
    durasi_menit: { type: Number, required: true },
    kalori_terbakar: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);