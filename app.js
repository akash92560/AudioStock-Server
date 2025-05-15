const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, testConnection } = require('./config/database');
const importData = require('./utils/dataImport');

// Import routes
const storeRoutes = require('./routes/storeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemTypeRoutes = require('./routes/itemTypeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const transferRoutes = require('./routes/transferRoutes');
const issueRoutes = require('./routes/issueRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// API Routes with /api prefix
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/item-types', itemTypeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/issues', issueRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'API is working' });
});

// Database initialization and data import
const initializeDatabase = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to the database. Exiting...');
      process.exit(1);
    }
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Import data from JSON files
    await importData();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = { app, initializeDatabase };