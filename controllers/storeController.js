const { Store, InventoryItem } = require('../models');

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

// Get a single store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ message: 'Failed to fetch store' });
  }
};

// Get items for a specific store
exports.getItemsByStoreId = async (req, res) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findByPk(storeId);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const items = await InventoryItem.findAll({
      where: { store: store.name }
    });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching store items:', error);
    res.status(500).json({ message: 'Failed to fetch store items' });
  }
};

// Create a new store
exports.createStore = async (req, res) => {
  try {

    const { name, location, description } = req.body;


    // Check if a store with the same name and location already exists
    const existingStore = await Store.findOne({
      where: { name, location }
    });

    if (existingStore) {
      return res.status(409).json({ message: `A store with the name "${name}" at location "${location}" already exists.` });
    }
    console.log('Creating new store:', req.body);

    const newStore = await Store.create({
      name: req.body.name,
      location: req.body.location,
      description: req.body.description
    });
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Failed to create store' });
  }
};

// Update a store
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    await store.update({
      name: req.body.name || store.name,
      location: req.body.location || store.location,
      description: req.body.description || store.description
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
    const store = await Store.findByPk(req.params.id);
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
