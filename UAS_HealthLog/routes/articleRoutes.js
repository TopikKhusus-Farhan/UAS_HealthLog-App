const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const verifikasiToken = require('../middleware/authMiddleware');

router.get('/', verifikasiToken, articleController.getBeritaKesehatan);

module.exports = router;