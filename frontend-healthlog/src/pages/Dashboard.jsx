import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Dashboard() {
  const [logHarian, setLogHarian] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const [showMakananModal, setShowMakananModal] = useState(false);
  const [showOlahragaModal, setShowOlahragaModal] = useState(false);

  // PERBAIKAN: Menambahkan state 'waktu' dengan default 'Makan Siang'
  const [formMakanan, setFormMakanan] = useState({ waktu: 'Makan Siang', nama: '', kalori: '' });
  const [formOlahraga, setFormOlahraga] = useState({ jenis: '', durasi: '', kalori: '' });
  const [formCatatan, setFormCatatan] = useState({ tidur: '', air: '' });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const hariIni = new Date().toISOString().split('T')[0]; 
      
      const response = await axios.get(`http://localhost:3000/api/log/${hariIni}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data;
      setLogHarian(data);
      setFormCatatan({
        tidur: data?.durasi_tidur_jam || '',
        air: data?.total_minum_gelas || ''
      });
    } catch (error) {
      console.error("Belum ada data hari ini atau terjadi kesalahan server.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []); 

  const getIconOlahraga = (jenis) => {
    if (!jenis) return '🏅';
    const teks = jenis.toLowerCase();
    if (teks.includes('lari') || teks.includes('jogging')) return '🏃';
    if (teks.includes('sepeda') || teks.includes('gowes')) return '🚴';
    if (teks.includes('bola') || teks.includes('futsal')) return '⚽';
    if (teks.includes('badminton')) return '🏸';
    if (teks.includes('renang')) return '🏊';
    if (teks.includes('basket')) return '🏀';
    if (teks.includes('voli')) return '🏐';
    if (teks.includes('tenis')) return '🎾';
    if (teks.includes('yoga') || teks.includes('meditasi')) return '🧘';
    if (teks.includes('gym') || teks.includes('beban')) return '🏋️';
    return '🏅'; 
  };

  const getIconMakanan = (nama) => {
    if (!nama) return '🍲';
    const teks = nama.toLowerCase();
    if (teks.includes('ayam')) return '🍗';
    if (teks.includes('mie') || teks.includes('mi ')) return '🍜';
    if (teks.includes('nasi')) return '🍚';
    if (teks.includes('roti')) return '🍞';
    if (teks.includes('sayur') || teks.includes('salad')) return '🥗';
    if (teks.includes('buah')) return '🍎';
    if (teks.includes('kopi')) return '☕';
    return '🍲';
  };

  const submitMakanan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const hariIni = new Date().toISOString().split('T')[0];
      
      // PERBAIKAN: Mengirim formMakanan.waktu sesuai pilihan dropdown
      await axios.post('http://localhost:3000/api/log/makanan', {
        tanggal: hariIni, 
        waktu: formMakanan.waktu, 
        nama_makanan: formMakanan.nama, 
        kalori: Number(formMakanan.kalori)
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      setShowMakananModal(false);
      setFormMakanan({ waktu: 'Makan Siang', nama: '', kalori: '' });
      fetchDashboardData();
    } catch (error) { 
      const pesanError = error.response?.data?.pesan || "Gagal mencatat makanan.";
      alert(pesanError); 
    }
  };

  const submitOlahraga = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const hariIni = new Date().toISOString().split('T')[0];
      
      await axios.post('http://localhost:3000/api/log/olahraga', {
        tanggal: hariIni, 
        jenis: formOlahraga.jenis, 
        durasi_menit: Number(formOlahraga.durasi), 
        kalori_terbakar: Number(formOlahraga.kalori)
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      setShowOlahragaModal(false);
      setFormOlahraga({ jenis: '', durasi: '', kalori: '' });
      fetchDashboardData();
    } catch (error) { 
      const pesanError = error.response?.data?.pesan || "Gagal mencatat olahraga.";
      alert(pesanError); 
    }
  };

  const submitCatatanHarian = async () => {
    try {
      const token = localStorage.getItem('token');
      const hariIni = new Date().toISOString().split('T')[0];
      
      await axios.post('http://localhost:3000/api/log/catatan', {
        tanggal: hariIni, 
        durasi_tidur_jam: Number(formCatatan.tidur), 
        total_minum_gelas: Number(formCatatan.air)
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      alert("Catatan harian berhasil disimpan!");
      fetchDashboardData();
    } catch (error) { 
      const pesanError = error.response?.data?.pesan || "URL Endpoint salah atau server mati.";
      alert(`Gagal menyimpan: ${pesanError}`); 
    }
  };

  const targetMasuk = 2000;
  const targetKeluar = 500;
  const kaloriMasuk = logHarian?.total_kalori_masuk || 0;
  const kaloriKeluar = logHarian?.total_kalori_keluar || 0;
  
  const persenMasuk = Math.min(Math.round((kaloriMasuk / targetMasuk) * 100) || 0, 100);
  const persenKeluar = Math.min(Math.round((kaloriKeluar / targetKeluar) * 100) || 0, 100);

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans relative">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Selamat pagi, {user?.nama || 'Farhan'}! 👋</h2>
            <p className="text-gray-500 mt-1 font-medium text-lg">Yuk penuhi target kesehatanmu hari ini!</p>
          </div>
        </div>

        {/* Ringkasan Kalori */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Card Kalori Masuk */}
          <div className="bg-green-50 p-6 rounded-3xl border border-green-200 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-green-500 text-3xl">🍴</div>
              <div>
                <p className="text-sm text-green-600 font-bold mb-1 uppercase tracking-wider">Kalori Masuk</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-gray-800">{kaloriMasuk}</p>
                  <span className="text-gray-500 font-medium">/ {targetMasuk} kkal</span>
                </div>
              </div>
            </div>
            {/* Circular Progress */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-green-500" strokeDasharray={`${persenMasuk}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">{persenMasuk}%</div>
            </div>
          </div>

          {/* Card Kalori Terbakar */}
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-200 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-orange-500 text-3xl">🔥</div>
              <div>
                <p className="text-sm text-orange-500 font-bold mb-1 uppercase tracking-wider">Kalori Terbakar</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-gray-800">{kaloriKeluar}</p>
                  <span className="text-gray-500 font-medium">/ {targetKeluar} kkal</span>
                </div>
              </div>
            </div>
            {/* Circular Progress */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-orange-500" strokeDasharray={`${persenKeluar}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">{persenKeluar}%</div>
            </div>
          </div>
        </div>

        {/* Daftar Makanan & Olahraga */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Box Makanan */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-800 text-lg">Histori Makanan</h3>
              <button onClick={() => setShowMakananModal(true)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <span>+</span> Tambah
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-hide">
              {logHarian?.aktivitas_makan?.length > 0 ? logHarian.aktivitas_makan.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl hover:bg-green-50 transition border border-transparent hover:border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-2xl">
                      {getIconMakanan(item.nama_makanan)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.nama_makanan}</p>
                      <p className="text-xs text-green-600 font-bold mt-0.5">{item.waktu} • {item.kalori} kkal</p>
                    </div>
                  </div>
                </div>
              )) : <div className="h-full flex items-center justify-center text-sm text-gray-400 font-medium">Belum ada makanan dicatat.</div>}
            </div>
          </div>

          {/* Box Olahraga */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-800 text-lg">Histori Olahraga</h3>
              <button onClick={() => setShowOlahragaModal(true)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <span>+</span> Tambah
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-hide">
              {logHarian?.aktivitas_olahraga?.length > 0 ? logHarian.aktivitas_olahraga.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl hover:bg-orange-50 transition border border-transparent hover:border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-2xl">
                      {getIconOlahraga(item.jenis)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.jenis}</p>
                      <p className="text-xs text-orange-500 font-bold mt-0.5">{item.durasi_menit} menit • {item.kalori_terbakar} kkal</p>
                    </div>
                  </div>
                </div>
              )) : <div className="h-full flex items-center justify-center text-sm text-gray-400 font-medium">Belum ada olahraga dicatat.</div>}
            </div>
          </div>
        </div>

        {/* Panel Catatan Harian */}
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            
            {/* Input Jam Tidur */}
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-purple-200 w-full md:w-64">
               <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl">🌙</div>
               <div className="flex-1">
                 <p className="text-xs text-gray-500 font-extrabold mb-1 uppercase tracking-wide">Jam Tidur</p>
                 <div className="flex items-center gap-2">
                   <input 
                      type="number" step="0.1"
                      className="w-full text-xl font-black text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none p-1.5 text-center transition-all"
                      value={formCatatan.tidur} onChange={(e) => setFormCatatan({...formCatatan, tidur: e.target.value})} placeholder="0"
                   />
                   <span className="text-sm font-semibold text-gray-500">jam</span>
                 </div>
               </div>
            </div>

            {/* Input Gelas Air */}
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-blue-200 w-full md:w-64">
               <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl">💧</div>
               <div className="flex-1">
                 <p className="text-xs text-gray-500 font-extrabold mb-1 uppercase tracking-wide">Gelas Air</p>
                 <div className="flex items-center gap-2">
                   <input 
                      type="number"
                      className="w-full text-xl font-black text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none p-1.5 text-center transition-all"
                      value={formCatatan.air} onChange={(e) => setFormCatatan({...formCatatan, air: e.target.value})} placeholder="0"
                   />
                   <span className="text-sm font-semibold text-gray-500">gelas</span>
                 </div>
               </div>
            </div>

          </div>
          
          <button 
            onClick={submitCatatanHarian}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Simpan Catatan
          </button>
        </div>

      </div>

      {/* ================= MODAL TAMBAH MAKANAN ================= */}
      {showMakananModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all scale-100 border border-green-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-sm">🥗</div>
              <h3 className="text-2xl font-extrabold text-gray-800">Tambah Makanan</h3>
              <p className="text-sm text-gray-500 font-medium">Catat asupan kalorimu hari ini</p>
            </div>
            <form onSubmit={submitMakanan} className="space-y-4">
              
              {/* PERBAIKAN: Fitur Dropdown Waktu Makan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Waktu Makan</label>
                <select 
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium appearance-none"
                  value={formMakanan.waktu} 
                  onChange={(e) => setFormMakanan({...formMakanan, waktu: e.target.value})} 
                  required
                >
                  <option value="Sarapan">Sarapan</option>
                  <option value="Makan Siang">Makan Siang</option>
                  <option value="Makan Malam">Makan Malam</option>
                  <option value="Camilan">Camilan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nama Makanan</label>
                <input 
                  type="text" className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium"
                  placeholder="Contoh: Nasi Padang" value={formMakanan.nama} onChange={(e) => setFormMakanan({...formMakanan, nama: e.target.value})} required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Jumlah Kalori (kkal)</label>
                <input 
                  type="number" className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium"
                  placeholder="Contoh: 450" value={formMakanan.kalori} onChange={(e) => setFormMakanan({...formMakanan, kalori: e.target.value})} required
                />
              </div>
              <div className="flex gap-3 mt-8 pt-2">
                <button type="button" onClick={() => setShowMakananModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH OLAHRAGA ================= */}
      {showOlahragaModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all scale-100 border border-orange-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-sm">🏃</div>
              <h3 className="text-2xl font-extrabold text-gray-800">Tambah Olahraga</h3>
              <p className="text-sm text-gray-500 font-medium">Catat aktivitas fisikmu hari ini</p>
            </div>
            <form onSubmit={submitOlahraga} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Jenis Olahraga</label>
                <input 
                  type="text" className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium"
                  placeholder="Contoh: Lari Pagi" value={formOlahraga.jenis} onChange={(e) => setFormOlahraga({...formOlahraga, jenis: e.target.value})} required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Durasi (menit)</label>
                  <input 
                    type="number" className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium"
                    placeholder="Contoh: 45" value={formOlahraga.durasi} onChange={(e) => setFormOlahraga({...formOlahraga, durasi: e.target.value})} required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Kalori (kkal)</label>
                  <input 
                    type="number" className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none text-sm text-gray-800 focus:bg-white transition-all font-medium"
                    placeholder="Contoh: 300" value={formOlahraga.kalori} onChange={(e) => setFormOlahraga({...formOlahraga, kalori: e.target.value})} required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-2">
                <button type="button" onClick={() => setShowOlahragaModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}