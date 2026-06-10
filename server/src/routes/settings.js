const express = require('express');
const router = express.Router();
const { Settings } = require('../models');

// Helper to get singleton settings
const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({});
    await settings.save();
  }
  return settings;
};

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/organization
router.put('/organization', async (req, res, next) => {
  try {
    const settings = await getSettings();
    settings.organization = { ...settings.organization, ...req.body };
    await settings.save();
    res.json({ success: true, data: settings.organization });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/salary-components
router.put('/salary-components', async (req, res, next) => {
  try {
    const settings = await getSettings();
    if (req.body.earnings) settings.salaryComponents.earnings = req.body.earnings;
    if (req.body.deductions) settings.salaryComponents.deductions = req.body.deductions;
    await settings.save();
    res.json({ success: true, data: settings.salaryComponents });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
