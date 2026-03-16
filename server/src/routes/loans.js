const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/loans
router.get('/', (req, res) => {
  res.json({ success: true, data: db.loans });
});

// POST /api/loans
router.post('/', (req, res) => {
  const loan = {
    id: `LN${String(db.loans.length + 1).padStart(3, '0')}`,
    ...req.body,
    paidEmis: 0,
    remainingAmount: req.body.amount,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  };
  db.loans.push(loan);
  res.status(201).json({ success: true, data: loan });
});

// PUT /api/loans/:id/pay-emi
router.put('/:id/pay-emi', (req, res) => {
  const loan = db.loans.find(l => l.id === req.params.id);
  if (!loan) return res.status(404).json({ message: 'Loan not found.' });

  loan.paidEmis += 1;
  loan.remainingAmount = Math.max(0, loan.remainingAmount - loan.emiAmount);
  if (loan.paidEmis >= loan.tenure) loan.status = 'Closed';

  res.json({ success: true, data: loan });
});

module.exports = router;
