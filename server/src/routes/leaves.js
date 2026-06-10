const express = require('express');
const router = express.Router();
const { Leave, Employee } = require('../models');

// GET /api/leaves
router.get('/', async (req, res, next) => {
  try {
    const { status, employeeId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;
    
    const leaves = await Leave.find(query);
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
});

// POST /api/leaves
router.post('/', async (req, res, next) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const leaveId = `LV${String(totalLeaves + 1).padStart(3, '0')}`;

    const leave = new Leave({
      id: leaveId,
      ...req.body,
      status: req.body.status || 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    });
    
    await leave.save();
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
});

// PUT /api/leaves/:id/approve
router.put('/:id/approve', async (req, res, next) => {
  try {
    const leave = await Leave.findOne({ id: req.params.id });
    if (!leave) return res.status(404).json({ message: 'Leave not found.' });
    
    leave.status = 'Approved';
    await leave.save();

    // Deduct from balance
    const emp = await Employee.findOne({ id: leave.employeeId });
    if (emp && emp.leaveBalance) {
      const typeKey = leave.type.includes('Casual') ? 'casual' :
                      leave.type.includes('Sick') ? 'sick' :
                      leave.type.includes('Earned') ? 'earned' : 'compOff';
      emp.leaveBalance[typeKey] = Math.max(0, (emp.leaveBalance[typeKey] || 0) - leave.days);
      await emp.save();
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
});

// PUT /api/leaves/:id/reject
router.put('/:id/reject', async (req, res, next) => {
  try {
    const leave = await Leave.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: 'Rejected' } },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: 'Leave not found.' });
    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
