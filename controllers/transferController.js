const { Transfer, InventoryItem } = require('../models');

// Get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll();
    res.json(transfers);
  } catch (error) {
    console.error('Error reading transfers data:', error);
    res.status(500).json({ message: 'Failed to read transfers data' });
  }
};

// Create a new transfer
exports.createTransfer = async (req, res) => {
  try {
    // Find the item to transfer
    const item = await InventoryItem.findByPk(req.body.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Create transfer record
    const newTransfer = await Transfer.create({
      itemId: req.body.itemId,
      itemName: item.name,
      itemType: item.type,
      fromStore: req.body.fromStore,
      toStore: req.body.toStore,
      transferDate: req.body.transferDate,
      reason: req.body.reason,
      // New fields
      name: req.body.name || null,
      details: req.body.details || null
    });
    
    // Update item location in inventory
    await item.update({ store: req.body.toStore });
    
    res.status(201).json(newTransfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ message: 'Failed to create transfer' });
  }
};