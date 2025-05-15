const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5123;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const STORES_FILE = path.join(DATA_DIR, 'stores.json');
const ITEM_TYPES_FILE = path.join(DATA_DIR, 'itemTypes.json');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');
const TRANSFERS_FILE = path.join(DATA_DIR, 'transfers.json');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  console.log(`Creating data directory: ${DATA_DIR}`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const initDataFile = (filePath, initialData = []) => {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating new data file: ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
};

// Initialize with default data
initDataFile(STORES_FILE, [
  { id: 1, name: 'Main Store', location: 'Building A' },
  { id: 2, name: 'Warehouse', location: 'Building B' },
  { id: 3, name: 'Display Room', location: 'Building C' }
]);

initDataFile(ITEM_TYPES_FILE, [
  { id: 1, name: 'Microphone', category: 'Audio Input', description: 'Audio input devices' },
  { id: 2, name: 'Speaker', category: 'Audio Output', description: 'Audio output devices' },
  { id: 3, name: 'Headphones', category: 'Personal Audio', description: 'Personal audio devices' },
  { id: 4, name: 'Mixer', category: 'Audio Processing', description: 'Audio mixing equipment' }
]);

initDataFile(INVENTORY_FILE, [
  { id: 'MIC001', name: 'Shure SM58', type: 'Microphone', store: 'Main Store', quantity: 5, condition: 'Excellent', purchaseDate: '2023-01-15' },
  { id: 'MIC002', name: 'Rode NT1A', type: 'Microphone', store: 'Warehouse', quantity: 3, condition: 'New', purchaseDate: '2023-02-20' },
  { id: 'SPK001', name: 'JBL EON615', type: 'Speaker', store: 'Main Store', quantity: 2, condition: 'Good', purchaseDate: '2022-11-10' },
  { id: 'SPK002', name: 'QSC K12.2', type: 'Speaker', store: 'Warehouse', quantity: 4, condition: 'Excellent', purchaseDate: '2023-03-05' },
  { id: 'HPH001', name: 'Audio-Technica ATH-M50x', type: 'Headphones', store: 'Display Room', quantity: 8, condition: 'New', purchaseDate: '2023-04-12' },
  { id: 'MXR001', name: 'Behringer X32', type: 'Mixer', store: 'Main Store', quantity: 1, condition: 'Good', purchaseDate: '2022-09-30' }
]);

initDataFile(TRANSFERS_FILE, []);
initDataFile(ISSUES_FILE, []);
initDataFile(CATEGORIES_FILE, [
  { id: 1, name: "Audio Input", description: "Devices that capture audio signals" },
  { id: 2, name: "Audio Output", description: "Devices that produce audio output" },
  { id: 3, name: "Personal Audio", description: "Personal listening devices" },
  { id: 4, name: "Audio Processing", description: "Equipment for processing audio signals" },
  { id: 5, name: "Recording Equipment", description: "Equipment used for recording audio" },
  { id: 6, name: "Cables & Connectors", description: "Audio cables and connection accessories" }
]);

// Helper functions to read and write data
const readData = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API Routes - add /api prefix to all routes

// Stores API
app.get('/api/stores', (req, res) => {
  console.log('GET /api/stores request received');
  try {
    const stores = readData(STORES_FILE);
    console.log('Sending stores data:', stores);
    res.json(stores);
  } catch (error) {
    console.error('Error reading stores data:', error);
    res.status(500).json({ message: 'Failed to read stores data' });
  }
});

app.post('/api/stores', (req, res) => {
  console.log('POST /api/stores request received:', req.body);
  try {
    const stores = readData(STORES_FILE);
    const newStore = {
      id: Date.now(),
      name: req.body.name,
      location: req.body.location
    };
    
    stores.push(newStore);
    writeData(STORES_FILE, stores);
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Failed to add store' });
  }
});

app.put('/api/stores/:id', (req, res) => {
  const stores = readData(STORES_FILE);
  const id = parseInt(req.params.id);
  const storeIndex = stores.findIndex(store => store.id === id);
  
  if (storeIndex === -1) {
    return res.status(404).json({ message: 'Store not found' });
  }
  
  stores[storeIndex] = { ...stores[storeIndex], ...req.body };
  writeData(STORES_FILE, stores);
  res.json(stores[storeIndex]);
});

app.delete('/api/stores/:id', (req, res) => {
  const stores = readData(STORES_FILE);
  const id = parseInt(req.params.id);
  const filteredStores = stores.filter(store => store.id !== id);
  
  if (filteredStores.length === stores.length) {
    return res.status(404).json({ message: 'Store not found' });
  }
  
  writeData(STORES_FILE, filteredStores);
  res.json({ message: 'Store deleted successfully' });
});

// Item Types API
app.get('/api/item-types', (req, res) => {
  console.log('GET /api/item-types request received');
  try {
    const itemTypes = readData(ITEM_TYPES_FILE);
    console.log('Sending item types data:', itemTypes);
    res.json(itemTypes);
  } catch (error) {
    console.error('Error reading item types data:', error);
    res.status(500).json({ message: 'Failed to read item types data' });
  }
});

app.post('/api/item-types', (req, res) => {
  console.log('POST /api/item-types request received:', req.body);
  try {
    const itemTypes = readData(ITEM_TYPES_FILE);
    const newItemType = {
      id: Date.now(),
      name: req.body.name,
      category: req.body.category || '',
      description: req.body.description || ''
    };
    
    itemTypes.push(newItemType);
    writeData(ITEM_TYPES_FILE, itemTypes);
    res.status(201).json(newItemType);
  } catch (error) {
    console.error('Error adding item type:', error);
    res.status(500).json({ message: 'Failed to add item type' });
  }
});

app.put('/api/item-types/:id', (req, res) => {
  const itemTypes = readData(ITEM_TYPES_FILE);
  const id = parseInt(req.params.id);
  const typeIndex = itemTypes.findIndex(type => type.id === id);
  
  if (typeIndex === -1) {
    return res.status(404).json({ message: 'Item type not found' });
  }
  
  itemTypes[typeIndex] = { ...itemTypes[typeIndex], ...req.body };
  writeData(ITEM_TYPES_FILE, itemTypes);
  res.json(itemTypes[typeIndex]);
});

app.delete('/api/item-types/:id', (req, res) => {
  const itemTypes = readData(ITEM_TYPES_FILE);
  const id = parseInt(req.params.id);
  const filteredTypes = itemTypes.filter(type => type.id !== id);
  
  if (filteredTypes.length === itemTypes.length) {
    return res.status(404).json({ message: 'Item type not found' });
  }
  
  writeData(ITEM_TYPES_FILE, filteredTypes);
  res.json({ message: 'Item type deleted successfully' });
});

// Categories API
app.get('/api/categories', (req, res) => {
  console.log('GET /api/categories request received');
  try {
    const categories = readData(CATEGORIES_FILE);
    console.log('Sending categories data:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error reading categories data:', error);
    res.status(500).json({ message: 'Failed to read categories data' });
  }
});

app.post('/api/categories', (req, res) => {
  console.log('POST /api/categories request received:', req.body);
  try {
    const categories = readData(CATEGORIES_FILE);
    const newCategory = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description || ''
    };
    
    categories.push(newCategory);
    writeData(CATEGORIES_FILE, categories);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category' });
  }
});

app.put('/api/categories/:id', (req, res) => {
  const categories = readData(CATEGORIES_FILE);
  const id = parseInt(req.params.id);
  const categoryIndex = categories.findIndex(category => category.id === id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  categories[categoryIndex] = { ...categories[categoryIndex], ...req.body };
  writeData(CATEGORIES_FILE, categories);
  res.json(categories[categoryIndex]);
});

app.delete('/api/categories/:id', (req, res) => {
  const categories = readData(CATEGORIES_FILE);
  const id = parseInt(req.params.id);
  const filteredCategories = categories.filter(category => category.id !== id);
  
  if (filteredCategories.length === categories.length) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  writeData(CATEGORIES_FILE, filteredCategories);
  res.json({ message: 'Category deleted successfully' });
});

// Inventory API
app.get('/api/inventory', (req, res) => {
  console.log('GET /api/inventory request received with query:', req.query);
  try {
    let inventory = readData(INVENTORY_FILE);
    
    // Debug: Log the first item to check its structure
    if (inventory.length > 0) {
      console.log('Sample inventory item:', JSON.stringify(inventory[0]));
    }
    
    // Filter by search term if provided
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      inventory = inventory.filter(item => 
        item.id.toLowerCase().includes(searchTerm) || 
        item.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by type if provided
    if (req.query.type && req.query.type !== 'all') {
      inventory = inventory.filter(item => item.type === req.query.type);
    }
    
    // Filter by store ID if provided
    if (req.query.storeId) {
      const stores = readData(STORES_FILE);
      const store = stores.find(s => s.id === parseInt(req.query.storeId));
      if (store) {
        inventory = inventory.filter(item => item.store === store.name);
      }
    }
    
    console.log(`Returning ${inventory.length} inventory items`);
    res.json(inventory);
  } catch (error) {
    console.error('Error reading inventory data:', error);
    res.status(500).json({ message: 'Failed to read inventory data' });
  }
});

app.post('/api/inventory', (req, res) => {
  const inventory = readData(INVENTORY_FILE);
  const newItem = {
    id: req.body.serialNumber || `ITEM${Date.now()}`,
    name: req.body.name,
    type: req.body.itemType,
    store: req.body.store,
    quantity: req.body.quantity || 1,
    purchaseDate: req.body.purchaseDate,
    notes: req.body.notes,
    price: req.body.price || '',
    itemSource: req.body.itemSource || 'Purchased',
    itemState: req.body.itemState || 'Working'
  };
  
  inventory.push(newItem);
  writeData(INVENTORY_FILE, inventory);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', (req, res) => {
  console.log('PUT /api/inventory/:id request received:', req.params.id);
  console.log('Request body:', req.body);
  
  const inventory = readData(INVENTORY_FILE);
  const id = req.params.id;
  const itemIndex = inventory.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    console.log('Item not found with ID:', id);
    return res.status(404).json({ message: 'Item not found' });
  }
  
  console.log('Original item:', inventory[itemIndex]);
  inventory[itemIndex] = { ...inventory[itemIndex], ...req.body };
  console.log('Updated item:', inventory[itemIndex]);
  
  writeData(INVENTORY_FILE, inventory);
  res.json(inventory[itemIndex]);
});

app.delete('/api/inventory/:id', (req, res) => {
  const inventory = readData(INVENTORY_FILE);
  const id = req.params.id;
  const filteredInventory = inventory.filter(item => item.id !== id);
  
  if (filteredInventory.length === inventory.length) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  writeData(INVENTORY_FILE, filteredInventory);
  res.json({ message: 'Item deleted successfully' });
});

// Transfers API
app.get('/api/transfers', (req, res) => {
  const transfers = readData(TRANSFERS_FILE);
  res.json(transfers);
});

app.post('/api/transfers', (req, res) => {
  const transfers = readData(TRANSFERS_FILE);
  const inventory = readData(INVENTORY_FILE);
  
  // Find the item to transfer
  const itemIndex = inventory.findIndex(item => item.id === req.body.itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  // Create transfer record
  const newTransfer = {
    id: Date.now(),
    itemId: req.body.itemId,
    itemName: inventory[itemIndex].name,
    itemType: inventory[itemIndex].type,
    fromStore: req.body.fromStore,
    toStore: req.body.toStore,
    transferDate: req.body.transferDate,
    reason: req.body.reason
  };
  
  // Update item location in inventory
  inventory[itemIndex].store = req.body.toStore;
  
  // Save changes
  transfers.push(newTransfer);
  writeData(TRANSFERS_FILE, transfers);
  writeData(INVENTORY_FILE, inventory);
  
  res.status(201).json(newTransfer);
});

// Issues API
app.get('/api/issues', (req, res) => {
  const issues = readData(ISSUES_FILE);
  res.json(issues);
});

app.post('/api/issues', (req, res) => {
  const issues = readData(ISSUES_FILE);
  const inventory = readData(INVENTORY_FILE);
  
  // Find the item to issue
  const itemIndex = inventory.findIndex(item => item.id === req.body.itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  // Create issue record
  const newIssue = {
    id: Date.now(),
    itemId: req.body.itemId,
    itemName: inventory[itemIndex].name,
    itemType: inventory[itemIndex].type,
    issuedTo: req.body.issuedTo,
    department: req.body.department,
    contactInfo: req.body.contactInfo,
    issueDate: req.body.issueDate,
    expectedReturnDate: req.body.expectedReturnDate,
    purpose: req.body.purpose,
    status: 'Issued'
  };
  
  // Update item availability in inventory
  if (inventory[itemIndex].quantity > 0) {
    inventory[itemIndex].quantity -= 1;
  }
  
  // Save changes
  issues.push(newIssue);
  writeData(ISSUES_FILE, issues);
  writeData(INVENTORY_FILE, inventory);
  
  res.status(201).json(newIssue);
});

app.put('/api/issues/:id/return', (req, res) => {
  const issues = readData(ISSUES_FILE);
  const inventory = readData(INVENTORY_FILE);
  const id = parseInt(req.params.id);
  
  // Find the issue record
  const issueIndex = issues.findIndex(issue => issue.id === id);
  if (issueIndex === -1) {
    return res.status(404).json({ message: 'Issue record not found' });
  }
  
  // Update issue status
  issues[issueIndex].status = 'Returned';
  issues[issueIndex].returnDate = new Date().toISOString().split('T')[0];
  
  // Find the item in inventory and increment quantity
  const itemIndex = inventory.findIndex(item => item.id === issues[issueIndex].itemId);
  if (itemIndex !== -1) {
    inventory[itemIndex].quantity += 1;
  }
  
  // Save changes
  writeData(ISSUES_FILE, issues);
  writeData(INVENTORY_FILE, inventory);
  
  res.json(issues[issueIndex]);
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'API is working' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Data directory: ${DATA_DIR}`);
  
  // List available endpoints
  console.log('Available endpoints:');
  console.log('- GET    /api/stores');
  console.log('- POST   /api/stores');
  console.log('- PUT    /api/stores/:id');
  console.log('- DELETE /api/stores/:id');
});
