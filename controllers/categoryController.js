const { Category } = require('../models');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log('GET /api/categories request received');
    const categories = await Category.findAll();
    console.log('Sending categories data:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error reading categories data:', error);
    res.status(500).json({ message: 'Failed to read categories data' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    console.log('POST /api/categories request received:', req.body);
    const newCategory = await Category.create({
      name: req.body.name,
      description: req.body.description || ''
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.update({
      name: req.body.name || category.name,
      description: req.body.description || category.description
    });
    
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};