const DailyLog = require('../models/DailyLog');

// ==========================================
// Fitur 1: Menambah Makanan (Kalori Masuk)
// ==========================================
const tambahMakanan = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    const { tanggal, waktu, nama_makanan, kalori } = req.body;
    let logHarian = await DailyLog.findOne({ user_id: userId, tanggal: tanggal });

    // Jika catatan belum ada sama sekali hari ini, kita buatkan dokumen baru!
    if (!logHarian) {
      logHarian = new DailyLog({
        user_id: userId,
        tanggal: tanggal,
        total_kalori_masuk: 0,
        total_kalori_keluar: 0,
        total_minum_gelas: 0,
        durasi_tidur_jam: 0,
        aktivitas_makan: [],
        aktivitas_olahraga: []
      });
    }

    // Masukkan makanan baru ke dalam array aktivitas_makan
    logHarian.aktivitas_makan.push({
      waktu: waktu,
      nama_makanan: nama_makanan,
      kalori: kalori
    });

    // Hitung ulang total kalori
    logHarian.total_kalori_masuk += kalori;

    await logHarian.save();

    res.status(201).json({
      pesan: "Makanan berhasil dicatat!",
      data: logHarian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mencatat makanan" });
  }
};


// ==========================================
// Fitur 2: Menambah Olahraga (Kalori Keluar)
// ==========================================
const tambahOlahraga = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { tanggal, jenis, durasi_menit, kalori_terbakar } = req.body;

    let logHarian = await DailyLog.findOne({ user_id: userId, tanggal: tanggal });

    if (!logHarian) {
      logHarian = new DailyLog({
        user_id: userId,
        tanggal: tanggal,
        total_kalori_masuk: 0,
        total_kalori_keluar: 0,
        total_minum_gelas: 0,
        durasi_tidur_jam: 0,
        aktivitas_makan: [],
        aktivitas_olahraga: []
      });
    }

    logHarian.aktivitas_olahraga.push({
      jenis: jenis,
      durasi_menit: durasi_menit,
      kalori_terbakar: kalori_terbakar
    });

    logHarian.total_kalori_keluar += kalori_terbakar;

    await logHarian.save();

    res.status(201).json({
      pesan: "Olahraga berhasil dicatat!",
      data: logHarian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mencatat olahraga" });
  }
};


// ==========================================
// Fitur 3: Mengambil Data Harian (Read)
// ==========================================
const getLogHarian = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { tanggal } = req.params; 

    const logHarian = await DailyLog.findOne({ user_id: userId, tanggal: tanggal });

    if (!logHarian) {
      return res.status(404).json({ 
        pesan: "Belum ada catatan untuk tanggal ini.",
        data: null
      });
    }

    res.status(200).json({
      pesan: "Data harian berhasil diambil!",
      data: logHarian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil data" });
  }
};


// ==========================================
// Fitur 4: Update Data Tidur & Minum
// ==========================================
const catatTidurMinum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tanggal, total_minum_gelas, durasi_tidur_jam, kualitas_tidur } = req.body;

    let logHarian = await DailyLog.findOne({ user_id: userId, tanggal: tanggal });

    if (!logHarian) {
      logHarian = new DailyLog({
        user_id: userId,
        tanggal: tanggal,
        total_kalori_masuk: 0,
        total_kalori_keluar: 0,
        total_minum_gelas: total_minum_gelas || 0,
        durasi_tidur_jam: durasi_tidur_jam || 0,
        kualitas_tidur: kualitas_tidur || 'Baik',
        aktivitas_makan: [],
        aktivitas_olahraga: []
      });
    } else {
      if (total_minum_gelas !== undefined) logHarian.total_minum_gelas = total_minum_gelas;
      if (durasi_tidur_jam !== undefined) logHarian.durasi_tidur_jam = durasi_tidur_jam;
      if (kualitas_tidur !== undefined) logHarian.kualitas_tidur = kualitas_tidur;
    }

    await logHarian.save();

    res.status(200).json({
      pesan: "Data tidur dan minum berhasil diperbarui!",
      data: logHarian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mencatat data kesehatan" });
  }
};

// ==========================================
// Fitur 5: Menghapus Makanan (Delete)
// ==========================================
const hapusMakanan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tanggal, id_item } = req.params;

    const logHarian = await DailyLog.findOne({ user_id: userId, tanggal: tanggal });
    
    if (!logHarian) {
      return res.status(404).json({ pesan: "Catatan harian tidak ditemukan." });
    }

    const makananYangDihapus = logHarian.aktivitas_makan.id(id_item);

    if (!makananYangDihapus) {
      return res.status(404).json({ pesan: "Data makanan tersebut tidak ditemukan." });
    }
    logHarian.aktivitas_makan.pull(id_item);
    await logHarian.save();

    res.status(200).json({
      pesan: "Makanan berhasil dihapus dan kalori telah disesuaikan!",
      data: logHarian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat menghapus makanan" });
  }
};

// ==========================================
// Fitur 6: Mengambil Semua Riwayat (Get All)
// ==========================================
const getSemuaRiwayat = async (req, res) => {
  try {
    const userId = req.user.id; 
    const riwayat = await DailyLog.find({ user_id: userId }).sort({ tanggal: -1 });

    if (!riwayat || riwayat.length === 0) {
      return res.status(404).json({ pesan: "Belum ada riwayat catatan sama sekali." });
    }

    res.status(200).json({
      pesan: "Riwayat berhasil ditarik!",
      total_hari_tercatat: riwayat.length,
      data: riwayat
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil riwayat" });
  }
};

module.exports = { 
  tambahMakanan, 
  tambahOlahraga, 
  getLogHarian, 
  catatTidurMinum,
  hapusMakanan,
  getSemuaRiwayat 
};