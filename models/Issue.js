const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Issue = sequelize.define('Issue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  issuedTo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactInfo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expectedReturnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Issued'
  }
}, {
  timestamps: true
});

module.exports = Issue;