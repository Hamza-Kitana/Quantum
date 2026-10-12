const express = require('express');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const ContactMessage = require('../models/ContactMessage');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

// POST /api/contact  (public)
router.post('/', submitLimiter, async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const doc = await ContactMessage.create({
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 200),
      phone: phone ? String(phone).slice(0, 40) : '',
      course: course ? String(course).slice(0, 120) : '',
      message: String(message).slice(0, 3000),
    });

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('[contact/create]', err);
    res.status(500).json({ error: 'Failed to send your message. Please try again.' });
  }
});

// GET /api/contact  (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('[contact/list]', err);
    res.status(500).json({ error: 'Failed to load messages.' });
  }
});

// PATCH /api/contact/:id/read  (admin only) — toggle read/unread
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const doc = await ContactMessage.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Message not found.' });
    doc.read = req.body && typeof req.body.read === 'boolean' ? req.body.read : !doc.read;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: 'Invalid message id.' });
  }
});

// DELETE /api/contact/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const doc = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Message not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid message id.' });
  }
});

module.exports = router;
