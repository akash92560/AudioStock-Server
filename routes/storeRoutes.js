const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Store routes
router.get('/', storeController.getAllStores);
router.post('/', storeController.createStore);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;