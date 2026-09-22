const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Metric / Stats route
router.get('/stats', employeeController.getDashboardStats);

// CSV Export route
router.get('/export/csv', employeeController.exportCSV);

// Main CRUD routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
