import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      // Mengirim data registrasi ke backend
      await axios.post('http://localhost:3000/api/auth/register', {
        nama,
        email,
        password
      });
      // Jika sukses, arahkan ke login
      navigate('/login'); 
    } catch (error) {
      setErrorMsg(error.response?.data?.pesan || "Gagal mendaftar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Daftar Akun</h2>
        
        {errorMsg && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{errorMsg}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={nama} onChange={(e) => setNama(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            Daftar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun? <button onClick={() => navigate('/login')} className="text-green-600 font-bold ml-1">Masuk</button>
        </p>
      </div>
    </div>
  );
}