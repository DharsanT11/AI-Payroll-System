const express = require('express');
const router = express.Router();
const { Employee } = require('../models');

// GET /api/taxes/summary
router.get('/summary', async (req, res, next) => {
  try {
    const activeEmployees = await Employee.find({ status: 'Active' });
    
    const epfTotal = activeEmployees.reduce((sum, e) => sum + Math.round((e.salary.basic || 0) / 12 * 0.12), 0);
    const esiTotal = activeEmployees.reduce((sum, e) => {
      const gross = Math.round((e.salary.ctc || 0) / 12);
      return sum + (gross <= 21000 ? Math.round(gross * 0.0075) : 0);
    }, 0);
    const ptTotal = activeEmployees.length * 200;
    
    // Simple TDS estimation
    const tdsTotal = activeEmployees.reduce((sum, e) => {
      const taxable = (e.salary.ctc || 0) - 300000;
      if (taxable <= 0) return sum;
      const annualTds = Math.round(taxable * 0.1);
      return sum + Math.round(annualTds / 12);
    }, 0);

    res.json({
      success: true,
      data: {
        epf: { label: 'Employee Provident Fund', amount: epfTotal, employees: activeEmployees.length },
        esi: { label: 'Employee State Insurance', amount: esiTotal, employees: activeEmployees.filter(e => Math.round((e.salary.ctc || 0) / 12) <= 21000).length },
        pt: { label: 'Professional Tax', amount: ptTotal, employees: activeEmployees.length },
        tds: { label: 'Tax Deducted at Source', amount: tdsTotal, employees: activeEmployees.length },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/taxes/employee/:id
router.get('/employee/:id', async (req, res, next) => {
  try {
    const emp = await Employee.findOne({ id: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });

    const monthly = Math.round((emp.salary.ctc || 0) / 12);
    const epf = Math.round((emp.salary.basic || 0) / 12 * 0.12);
    const esi = monthly <= 21000 ? Math.round(monthly * 0.0075) : 0;

    res.json({
      success: true,
      data: {
        employee: `${emp.firstName} ${emp.lastName}`,
        pan: emp.tax && emp.tax.pan ? emp.tax.pan : 'PENDING',
        regime: emp.tax && emp.tax.regime ? emp.tax.regime : 'New',
        epf,
        esi,
        pt: 200,
        monthlyGross: monthly,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
