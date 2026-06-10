const express = require('express');
const router = express.Router();
const { Loan } = require('../models');

// GET /api/loans
router.get('/', async (req, res, next) => {
  try {
    const loans = await Loan.find();
    res.json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
});

// POST /api/loans
router.post('/', async (req, res, next) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const loan = new Loan({
      id: `LN${String(totalLoans + 1).padStart(3, '0')}`,
      ...req.body,
      paidEmis: 0,
      remainingAmount: req.body.amount,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    });
    await loan.save();
    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
});

// PUT /api/loans/:id/pay-emi
router.put('/:id/pay-emi', async (req, res, next) => {
  try {
    const loan = await Loan.findOne({ id: req.params.id });
    if (!loan) return res.status(404).json({ message: 'Loan not found.' });

    loan.paidEmis += 1;
    loan.remainingAmount = Math.max(0, loan.remainingAmount - loan.emiAmount);
    if (loan.paidEmis >= loan.tenure) loan.status = 'Closed';

    await loan.save();
    res.json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
