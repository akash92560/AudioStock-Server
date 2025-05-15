const { Issue, InventoryItem } = require('../models');

// Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll();
    res.json(issues);
  } catch (error) {
    console.error('Error reading issues data:', error);
    res.status(500).json({ message: 'Failed to read issues data' });
  }
};

// Create a new issue
exports.createIssue = async (req, res) => {
  try {
    // Find the item to issue
    const item = await InventoryItem.findByPk(req.body.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Create issue record
    const newIssue = await Issue.create({
      itemId: req.body.itemId,
      itemName: item.name,
      itemType: item.type,
      issuedTo: req.body.issuedTo,
      department: req.body.department,
      contactInfo: req.body.contactInfo,
      issueDate: req.body.issueDate,
      expectedReturnDate: req.body.expectedReturnDate,
      purpose: req.body.purpose,
      status: 'Issued'
    });
    
    // Update item availability in inventory
    if (item.quantity > 0) {
      await item.update({ quantity: item.quantity - 1 });
    }
    
    res.status(201).json(newIssue);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Failed to create issue' });
  }
};

// Return an issued item
exports.returnItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const issue = await Issue.findByPk(id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }
    
    // Update issue status
    await issue.update({
      status: 'Returned',
      returnDate: new Date().toISOString().split('T')[0]
    });
    
    // Find the item in inventory and increment quantity
    const item = await InventoryItem.findByPk(issue.itemId);
    if (item) {
      await item.update({ quantity: item.quantity + 1 });
    }
    
    res.json(issue);
  } catch (error) {
    console.error('Error returning item:', error);
    res.status(500).json({ message: 'Failed to return item' });
  }
};