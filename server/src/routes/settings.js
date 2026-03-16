const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/settings
router.get('/', (req, res) => {
  res.json({ success: true, data: db.settings });
});

// PUT /api/settings/organization
router.put('/organization', (req, res) => {
  db.settings.organization = { ...db.settings.organization, ...req.body };
  res.json({ success: true, data: db.settings.organization });
});

// PUT /api/settings/salary-components
router.put('/salary-components', (req, res) => {
  if (req.body.earnings) db.settings.salaryComponents.earnings = req.body.earnings;
  if (req.body.deductions) db.settings.salaryComponents.deductions = req.body.deductions;
  res.json({ success: true, data: db.settings.salaryComponents });
});

module.exports = router;
