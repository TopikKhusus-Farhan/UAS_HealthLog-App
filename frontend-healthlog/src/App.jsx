import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import kelima halaman yang sudah kamu buat di folder 'pages'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Riwayat from './pages/Riwayat';
import Artikel from './pages/Artikel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Redirect: memindahkan user dari "/" ke "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 👇 INI YANG HILANG SEBELUMNYA 👇 */}
        <Route path="/login" element={<Login />} />
        {/* 👆 ========================== 👆 */}

        <Route path="/register" element={<Register />} />

        {/* Rute untuk halaman utama aplikasi */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/artikel" element={<Artikel />} />

        {/* Rute Default: Jika user asal mengetik URL, kembalikan ke Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;