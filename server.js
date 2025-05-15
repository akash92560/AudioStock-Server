const { app, initializeDatabase } = require('./app');

// Set port
const PORT = process.env.PORT || 5123;

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    
    // List available endpoints
    console.log('Available endpoints:');
    console.log('- GET    /api/stores');
    console.log('- POST   /api/stores');
    console.log('- PUT    /api/stores/:id');
    console.log('- DELETE /api/stores/:id');
    console.log('- GET    /api/categories');
    console.log('- POST   /api/categories');
    console.log('- PUT    /api/categories/:id');
    console.log('- DELETE /api/categories/:id');
    console.log('- GET    /api/item-types');
    console.log('- POST   /api/item-types');
    console.log('- PUT    /api/item-types/:id');
    console.log('- DELETE /api/item-types/:id');
    console.log('- GET    /api/inventory');
    console.log('- POST   /api/inventory');
    console.log('- PUT    /api/inventory/:id');
    console.log('- DELETE /api/inventory/:id');
    console.log('- GET    /api/transfers');
    console.log('- POST   /api/transfers');
    console.log('- GET    /api/issues');
    console.log('- POST   /api/issues');
    console.log('- PUT    /api/issues/:id/return');
  });
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});