const express = require('express');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

// POST /api/newsletter  (public)
router.post('/', subscribeLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !validator.isEmail(String(email))) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    const normalized = String(email).trim().toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email: normalized });
    if (existing) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }

    await NewsletterSubscriber.create({ email: normalized });
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }
    console.error('[newsletter/create]', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// GET /api/newsletter  (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const subs = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    console.error('[newsletter/list]', err);
    res.status(500).json({ error: 'Failed to load subscribers.' });
  }
});

// GET /api/newsletter/export.csv  (admin only)
router.get('/export.csv', requireAuth, async (req, res) => {
  try {
    const subs = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    const rows = ['email,subscribed_at', ...subs.map((s) => `${s.email},${s.createdAt.toISOString()}`)];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
    res.send(rows.join('\n'));
  } catch (err) {
    console.error('[newsletter/export]', err);
    res.status(500).json({ error: 'Failed to export subscribers.' });
  }
});

// DELETE /api/newsletter/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const doc = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Subscriber not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid subscriber id.' });
  }
});

module.exports = router;
