const express = require('express');
const Faq = require('../models/Faq');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/faq  (public: published only, unless authenticated admin passes ?all=1)
router.get('/', async (req, res) => {
  try {
    const isAdmin = Boolean(req.session && req.session.adminId);
    const filter = isAdmin && req.query.all ? {} : { published: true };
    const items = await Faq.find(filter).sort({ topic: 1, order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('[faq/list]', err);
    res.status(500).json({ error: 'Failed to load FAQ items.' });
  }
});

// POST /api/faq  (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { question, answer, questionAr, answerAr, topic, published, order } = req.body || {};
    if (!question || !answer || !topic) {
      return res.status(400).json({ error: 'question, answer and topic are required.' });
    }
    const item = await Faq.create({ question, answer, questionAr, answerAr, topic, published, order });
    res.status(201).json(item);
  } catch (err) {
    console.error('[faq/create]', err);
    res.status(400).json({ error: err.message || 'Failed to create FAQ item.' });
  }
});

// PUT /api/faq/:id  (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const fields = ['question', 'answer', 'questionAr', 'answerAr', 'topic', 'published', 'order'];
    const update = {};
    for (const f of fields) if (f in (req.body || {})) update[f] = req.body[f];

    const item = await Faq.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'FAQ item not found.' });
    res.json(item);
  } catch (err) {
    console.error('[faq/update]', err);
    res.status(400).json({ error: err.message || 'Failed to update FAQ item.' });
  }
});

// DELETE /api/faq/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Faq.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'FAQ item not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid FAQ item id.' });
  }
});

module.exports = router;
