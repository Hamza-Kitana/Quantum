const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

// GET /api/settings  (public)
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error('[settings/get]', err);
    res.status(500).json({ error: 'Failed to load settings.' });
  }
});

// PUT /api/settings  (admin only)
router.put('/', requireAuth, async (req, res) => {
  try {
    const fields = ['contactEmail', 'contactPhone', 'whatsappNumber', 'whatsappMessage', 'whatsappMessageAr', 'social', 'stats'];
    const update = {};
    for (const f of fields) if (f in (req.body || {})) update[f] = req.body[f];

    const settings = await getOrCreateSettings();
    Object.assign(settings, update);
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error('[settings/update]', err);
    res.status(400).json({ error: err.message || 'Failed to update settings.' });
  }
});

module.exports = router;
