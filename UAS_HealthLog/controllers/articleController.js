const axios = require('axios');

const getBeritaKesehatan = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY; 
    
    // Mencari semua berita kesehatan berbahasa Indonesia terbaru
    const url = `https://newsapi.org/v2/everything?q=kesehatan&language=id&sortBy=publishedAt&apiKey=${apiKey}`;

    const response = await axios.get(url);

    res.status(200).json({
      pesan: "Berita kesehatan berhasil disedot!",
      total_berita: response.data.totalResults,
      data: response.data.articles // Ini adalah array berisi banyak berita
    });

  } catch (error) {
    console.error("Gagal menyedot berita:", error.message);
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil berita dari server luar." });
  }
};

module.exports = { getBeritaKesehatan };