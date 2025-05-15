const { Store } = require('../models');

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    console.log('GET /api/stores request received');
    const stores = await Store.findAll();
    console.log('Sending stores data:', stores);
    res.json(stores);
  } catch (error) {
    console.error('Error reading stores data:', error);
    res.status(500).json({ message: 'Failed to read stores data' });
  }
};

// Create a new store
exports.createStore = async (req, res) => {
  try {
    console.log('POST /api/stores request received:', req.body);
    const newStore = await Store.create({
      name: req.body.name,
      location: req.body.location
    });
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Failed to add store' });
  }
};

// Update a store
exports.updateStore = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const store = await Store.findByPk(id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    await store.update({
      name: req.body.name || store.name,
      location: req.body.location || store.location
    });
    
    res.json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ message: 'Failed to update store' });
  }
};

// Delete a store
exports.deleteStore = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const store = await Store.findByPk(id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    await store.destroy();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ message: 'Failed to delete store' });
  }
};