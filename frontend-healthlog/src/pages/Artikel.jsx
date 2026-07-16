import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function Artikel() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Memanggil API Artikel
      const response = await axios.get('http://localhost:3000/api/artikel', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArtikel(response.data.data);
    } catch (error) {
      console.error("Gagal memuat artikel", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Artikel Kesehatan</h2>
            <p className="text-sm text-gray-500">Dapatkan informasi kesehatan terbaru</p>
          </div>
          <button onClick={fetchArtikel} className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
            <span>↻</span> Muat Ulang
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
              <div className="text-6xl text-blue-200 mb-4 animate-pulse">📄</div>
              <p className="text-lg font-bold text-gray-800">Memuat artikel...</p>
            </div>
          ) : (
            <div className="space-y-4 col-span-2">
              {artikel.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                  {item.urlToImage && (
                    <img src={item.urlToImage} alt="thumbnail" className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 object-cover" />
                  )}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 leading-tight">{item.title}</h3>
                      <p className="text-xs text-green-600 font-medium mt-1">{item.source.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 font-medium text-right mt-2 hover:underline">
                      Baca Selengkapnya ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}