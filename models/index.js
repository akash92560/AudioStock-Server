const Store = require('./Store');
const Category = require('./Category');
const ItemType = require('./ItemType');
const InventoryItem = require('./InventoryItem');
const Transfer = require('./Transfer');
const Issue = require('./Issue');

// Define relationships if needed
// For example:
// ItemType.belongsTo(Category, { foreignKey: 'categoryId' });
// Category.hasMany(ItemType, { foreignKey: 'categoryId' });

module.exports = {
  Store,
  Category,
  ItemType,
  InventoryItem,
  Transfer,
  Issue
};