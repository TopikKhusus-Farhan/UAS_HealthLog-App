const jwt = require('jsonwebtoken');

const verifikasiToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ pesan: "Akses ditolak! Tiket token tidak ditemukan." });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ pesan: "Akses ditolak! Format token salah." });
  }

  try {
    const tokenTerverifikasi = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = tokenTerverifikasi;
   
    next();

  } catch (error) {
    res.status(400).json({ pesan: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};

module.exports = verifikasiToken;