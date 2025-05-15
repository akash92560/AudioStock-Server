const { InventoryItem, Store } = require('../models');
const { Op } = require('sequelize');

// Get all inventory items with optional filtering
exports.getAllInventoryItems = async (req, res) => {
  try {
    console.log('GET /api/inventory request received with query:', req.query);
    
    let whereClause = {};
    
    // Filter by search term if provided
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      whereClause = {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { name: { [Op.like]: `%${searchTerm}%` } }
        ]
      };
    }
    
    // Filter by type if provided
    if (req.query.type && req.query.type !== 'all') {
      whereClause.type = req.query.type;
    }
    
    // Filter by store ID if provided
    if (req.query.storeId) {
      const store = await Store.findByPk(parseInt(req.query.storeId));
      if (store) {
        whereClause.store = store.name;
      }
    }
    
    const inventory = await InventoryItem.findAll({ where: whereClause });
    console.log(`Returning ${inventory.length} inventory items`);
    res.json(inventory);
  } catch (error) {
    console.error('Error reading inventory data:', error);
    res.status(500).json({ message: 'Failed to read inventory data' });
  }
};

// Create a new inventory item
exports.createInventoryItem = async (req, res) => {
  try {
    const newItem = await InventoryItem.create({
      id: req.body.serialNumber || `ITEM${Date.now()}`,
      name: req.body.name,
      type: req.body.itemType,
      store: req.body.store,
      quantity: req.body.quantity || 1,
      condition: req.body.condition,
      purchaseDate: req.body.purchaseDate,
      notes: req.body.notes
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Failed to add inventory item' });
  }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await InventoryItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Process numeric values
    let updateData = {
      name: req.body.name || item.name,
      type: req.body.type || item.type,
      store: req.body.store || item.store,
      condition: req.body.condition || item.condition,
      serialNumber: req.body.serialNumber,
      itemSource: req.body.itemSource || item.itemSource || 'Purchased',
      itemState: req.body.itemState || item.itemState || 'Working',
      notes: req.body.notes
    };
    
    // Handle dates - convert empty strings to null
    updateData.purchaseDate = req.body.purchaseDate === '' ? null : req.body.purchaseDate;
    updateData.expiryDate = req.body.expiryDate === '' ? null : req.body.expiryDate;
    
    // Handle quantity - ensure it's a number
    if (req.body.quantity !== undefined) {
      updateData.quantity = parseInt(req.body.quantity);
    }
    
    // Handle price - ensure it's a number or null
    if (req.body.price !== undefined) {
      updateData.price = req.body.price === '' || req.body.price === null ? 
        null : parseFloat(req.body.price);
    }
    
    console.log('Updating item with data:', updateData);
    
    await item.update(updateData);
    
    console.log('Updated item data:', item.toJSON());
    res.json(item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Failed to update inventory item' });
  }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await InventoryItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Failed to delete inventory item' });
  }
};
