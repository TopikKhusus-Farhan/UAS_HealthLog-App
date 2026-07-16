const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');
const verifikasiToken = require('../middleware/authMiddleware'); 

router.post('/makanan', verifikasiToken, dailyLogController.tambahMakanan);
router.post('/olahraga', verifikasiToken, dailyLogController.tambahOlahraga);
router.delete('/makanan/:tanggal/:id_item', verifikasiToken, dailyLogController.hapusMakanan);
router.get('/riwayat/semua', verifikasiToken, dailyLogController.getSemuaRiwayat);

router.get('/:tanggal', verifikasiToken, dailyLogController.getLogHarian);

module.exports = router;