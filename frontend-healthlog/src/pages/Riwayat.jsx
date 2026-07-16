import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem('token');
        // Memanggil API riwayat semua
        const response = await axios.get('http://localhost:3000/api/log/riwayat/semua', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRiwayat(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil riwayat", error);
      }
    };
    fetchRiwayat();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Riwayat Kesehatan</h2>
        <p className="text-sm text-gray-500 mb-8">Ringkasan catatan harianmu</p>

        <div className="space-y-4">
          {riwayat.map((hari, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-bold text-gray-800 mb-4">{hari.tanggal}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-8">
                  <div>
                    <p className="text-sm font-bold text-gray-800">🍴 {hari.total_kalori_masuk}</p>
                    <p className="text-xs text-gray-500">kkal masuk</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">🔥 {hari.total_kalori_keluar}</p>
                    <p className="text-xs text-gray-500">kkal terbakar</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">🌙 {hari.durasi_tidur_jam}</p>
                    <p className="text-xs text-gray-500">jam tidur</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">💧 {hari.total_minum_gelas}</p>
                    <p className="text-xs text-gray-500">gelas air</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {riwayat.length === 0 && <p className="text-sm text-gray-500">Belum ada riwayat tercatat.</p>}
        </div>
      </div>
    </div>
  );
}