const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/employees
router.get('/', (req, res) => {
  const { status, department, search } = req.query;
  let employees = [...db.employees];

  if (status) employees = employees.filter(e => e.status === status);
  if (department) employees = employees.filter(e => e.department === department);
  if (search) {
    const q = search.toLowerCase();
    employees = employees.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: employees.length, data: employees });
});

// GET /api/employees/:id
router.get('/:id', (req, res) => {
  const emp = db.employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found.' });
  res.json({ success: true, data: emp });
});

// POST /api/employees
router.post('/', (req, res) => {
  const newEmployee = {
    id: `EMP${String(db.employees.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'Active',
    leaveBalance: { casual: 12, sick: 12, earned: 0, compOff: 0 },
  };
  db.employees.push(newEmployee);
  res.status(201).json({ success: true, data: newEmployee });
});

// PUT /api/employees/:id
router.put('/:id', (req, res) => {
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found.' });

  db.employees[idx] = { ...db.employees[idx], ...req.body };
  res.json({ success: true, data: db.employees[idx] });
});

// DELETE /api/employees/:id
router.delete('/:id', (req, res) => {
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found.' });

  db.employees.splice(idx, 1);
  res.json({ success: true, message: 'Employee deleted.' });
});

module.exports = router;
