require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json()); 

// Langsung panggil file route spesifiknya
const authRoutes = require('./routes/authRoutes');
const dailyLogRoutes = require('./routes/dailyLogRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Daftarkan dengan awalan URL yang lengkap
app.use('/api/auth', authRoutes);
app.use('/api/log', dailyLogRoutes);
app.use('/api/artikel', articleRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Berhasil terhubung ke MongoDB!'))
  .catch((err) => console.error('Gagal terhubung:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});