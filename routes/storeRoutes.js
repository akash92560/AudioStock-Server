const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// GET all stores
router.get('/', storeController.getAllStores);

// GET a single store by ID
router.get('/:id', storeController.getStoreById);

// GET items for a specific store
router.get('/:id/items', storeController.getItemsByStoreId);

// POST create a new store
router.post('/', storeController.createStore);

// PUT update a store
router.put('/:id', storeController.updateStore);

// DELETE a store
router.delete('/:id', storeController.deleteStore);

module.exports = router;
