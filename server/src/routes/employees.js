const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Employee, User } = require('../models');

// GET /api/employees
router.get('/', async (req, res, next) => {
  try {
    const { status, department, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (department) query.department = department;
    
    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [
        { firstName: q },
        { lastName: q },
        { email: q },
        { id: q }
      ];
    }
    
    const employees = await Employee.find(query);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
});

// GET /api/employees/:id
router.get('/:id', async (req, res, next) => {
  try {
    const emp = await Employee.findOne({ id: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ success: true, data: emp });
  } catch (error) {
    next(error);
  }
});

// POST /api/employees
router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, department, designation, salary } = req.body;

    if (!firstName || !lastName || !email || !salary || !salary.ctc) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: `Employee with email ${email} already exists.` });
    }

    const totalEmployees = await Employee.countDocuments();
    const newId = `EMP${String(totalEmployees + 1).padStart(3, '0')}`;

    const newEmployee = new Employee({
      id: newId,
      ...req.body,
      status: 'Active',
      leaveBalance: { casual: 12, sick: 12, earned: 0, compOff: 0 },
      tax: req.body.tax || { pan: 'PENDING', regime: 'New' },
    });
    await newEmployee.save();

    const totalUsers = await User.countDocuments();
    const newUserId = `USR${String(totalUsers + 1).padStart(3, '0')}`;
    const newUser = new User({
      id: newUserId,
      name: `${firstName} ${lastName}`,
      email,
      password: bcrypt.hashSync('employee123', 10),
      role: 'employee',
      employeeId: newId,
    });
    await newUser.save();

    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    next(error);
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res, next) => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ success: true, data: emp });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const emp = await Employee.findOneAndDelete({ id: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ success: true, message: 'Employee deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
