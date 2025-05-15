const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

// Transfer routes
router.get('/', transferController.getAllTransfers);
router.post('/', transferController.createTransfer);

module.exports = router;