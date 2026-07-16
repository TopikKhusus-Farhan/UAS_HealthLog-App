const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Fungsi Register
const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // 1. Cek apakah email sudah pernah didaftarkan
    const emailTerdaftar = await User.findOne({ email });
    if (emailTerdaftar) {
      return res.status(400).json({ pesan: "Email sudah digunakan, coba yang lain!" });
    }

    // 2. Acak password demi keamanan (Secure Coding)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Buat user baru dan simpan ke database
    const userBaru = new User({
      nama,
      email,
      password: hashedPassword
    });
    await userBaru.save();

    // 4. Kirim balasan sukses 
    res.status(201).json({
      pesan: "Registrasi berhasil!",
      user: {
        id: userBaru._id,
        nama: userBaru.nama,
        email: userBaru.email,
        target: userBaru.target
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan pada server" });
  }
};

//Fungsi Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ pesan: "Email tidak terdaftar!" });
    }

    // 2. Cocokkan password yang diinput dengan yang ada di database
    const isPasswordCocok = await bcrypt.compare(password, user.password);
    if (!isPasswordCocok) {
      return res.status(400).json({ pesan: "Password salah!" });
    }

    // 3. Buatkan Tiket (Token JWT) jika password benar
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    // 4. Kirim balasan beserta tiketnya
    res.json({
      pesan: "Login berhasil!",
      token: token, 
      user: {
        id: user._id,
        nama: user.nama,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan pada server" });
  }
};

module.exports = { register, login };