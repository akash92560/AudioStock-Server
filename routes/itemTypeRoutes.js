const express = require('express');
const router = express.Router();
const itemTypeController = require('../controllers/itemTypeController');

// Item type routes
router.get('/', itemTypeController.getAllItemTypes);
router.post('/', itemTypeController.createItemType);
router.put('/:id', itemTypeController.updateItemType);
router.delete('/:id', itemTypeController.deleteItemType);

module.exports = router;