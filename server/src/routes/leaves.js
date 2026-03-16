const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/leaves
router.get('/', (req, res) => {
  const { status, employeeId } = req.query;
  let leaves = [...db.leaves];
  if (status) leaves = leaves.filter(l => l.status === status);
  if (employeeId) leaves = leaves.filter(l => l.employeeId === employeeId);
  res.json({ success: true, count: leaves.length, data: leaves });
});

// POST /api/leaves
router.post('/', (req, res) => {
  const leave = {
    id: `LV${String(db.leaves.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0],
  };
  db.leaves.push(leave);
  res.status(201).json({ success: true, data: leave });
});

// PUT /api/leaves/:id/approve
router.put('/:id/approve', (req, res) => {
  const leave = db.leaves.find(l => l.id === req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave not found.' });
  leave.status = 'Approved';

  // Deduct from balance
  const emp = db.employees.find(e => e.id === leave.employeeId);
  if (emp && emp.leaveBalance) {
    const typeKey = leave.type.includes('Casual') ? 'casual' :
                    leave.type.includes('Sick') ? 'sick' :
                    leave.type.includes('Earned') ? 'earned' : 'compOff';
    emp.leaveBalance[typeKey] = Math.max(0, (emp.leaveBalance[typeKey] || 0) - leave.days);
  }

  res.json({ success: true, data: leave });
});

// PUT /api/leaves/:id/reject
router.put('/:id/reject', (req, res) => {
  const leave = db.leaves.find(l => l.id === req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave not found.' });
  leave.status = 'Rejected';
  res.json({ success: true, data: leave });
});

module.exports = router;
