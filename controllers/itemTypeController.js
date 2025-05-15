const { ItemType } = require('../models');

// Get all item types
exports.getAllItemTypes = async (req, res) => {
  try {
    console.log('GET /api/item-types request received');
    const itemTypes = await ItemType.findAll();
    console.log('Sending item types data:', itemTypes);
    res.json(itemTypes);
  } catch (error) {
    console.error('Error reading item types data:', error);
    res.status(500).json({ message: 'Failed to read item types data' });
  }
};

// Create a new item type
exports.createItemType = async (req, res) => {
  try {
    console.log('POST /api/item-types request received:', req.body);
    const newItemType = await ItemType.create({
      name: req.body.name,
      category: req.body.category || '',
      description: req.body.description || ''
    });
    res.status(201).json(newItemType);
  } catch (error) {
    console.error('Error adding item type:', error);
    res.status(500).json({ message: 'Failed to add item type' });
  }
};

// Update an item type
exports.updateItemType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemType = await ItemType.findByPk(id);
    
    if (!itemType) {
      return res.status(404).json({ message: 'Item type not found' });
    }
    
    await itemType.update({
      name: req.body.name || itemType.name,
      category: req.body.category || itemType.category,
      description: req.body.description || itemType.description
    });
    
    res.json(itemType);
  } catch (error) {
    console.error('Error updating item type:', error);
    res.status(500).json({ message: 'Failed to update item type' });
  }
};

// Delete an item type
exports.deleteItemType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemType = await ItemType.findByPk(id);
    
    if (!itemType) {
      return res.status(404).json({ message: 'Item type not found' });
    }
    
    await itemType.destroy();
    res.json({ message: 'Item type deleted successfully' });
  } catch (error) {
    console.error('Error deleting item type:', error);
    res.status(500).json({ message: 'Failed to delete item type' });
  }
};