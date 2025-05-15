const fs = require('fs');
const path = require('path');
const { 
  Store, 
  Category, 
  ItemType, 
  InventoryItem, 
  Transfer, 
  Issue 
} = require('../models');

// Data storage paths
const DATA_DIR = path.join(__dirname, '../data');
const STORES_FILE = path.join(DATA_DIR, 'stores.json');
const ITEM_TYPES_FILE = path.join(DATA_DIR, 'itemTypes.json');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');
const TRANSFERS_FILE = path.join(DATA_DIR, 'transfers.json');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Helper function to read JSON data
const readJsonFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Import data from JSON files to SQLite database
const importData = async () => {
  try {
    // Import stores
    const stores = readJsonFile(STORES_FILE);
    for (const store of stores) {
      await Store.findOrCreate({
        where: { id: store.id },
        defaults: store
      });
    }
    console.log(`Imported ${stores.length} stores`);

    // Import categories
    const categories = readJsonFile(CATEGORIES_FILE);
    for (const category of categories) {
      await Category.findOrCreate({
        where: { id: category.id },
        defaults: category
      });
    }
    console.log(`Imported ${categories.length} categories`);

    // Import item types
    const itemTypes = readJsonFile(ITEM_TYPES_FILE);
    for (const itemType of itemTypes) {
      await ItemType.findOrCreate({
        where: { id: itemType.id },
        defaults: itemType
      });
    }
    console.log(`Imported ${itemTypes.length} item types`);

    // Import inventory items
    const inventoryItems = readJsonFile(INVENTORY_FILE);
    for (const item of inventoryItems) {
      await InventoryItem.findOrCreate({
        where: { id: item.id },
        defaults: item
      });
    }
    console.log(`Imported ${inventoryItems.length} inventory items`);

    // Import transfers
    const transfers = readJsonFile(TRANSFERS_FILE);
    for (const transfer of transfers) {
      await Transfer.findOrCreate({
        where: { id: transfer.id },
        defaults: transfer
      });
    }
    console.log(`Imported ${transfers.length} transfers`);

    // Import issues
    const issues = readJsonFile(ISSUES_FILE);
    for (const issue of issues) {
      await Issue.findOrCreate({
        where: { id: issue.id },
        defaults: issue
      });
    }
    console.log(`Imported ${issues.length} issues`);

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

module.exports = importData;