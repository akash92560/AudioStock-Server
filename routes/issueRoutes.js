const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

// Issue routes
router.get('/', issueController.getAllIssues);
router.post('/', issueController.createIssue);
router.put('/:id/return', issueController.returnItem);

module.exports = router;