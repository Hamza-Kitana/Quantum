const express = require('express');
const Testimonial = require('../models/Testimonial');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials  (public: published only, unless authenticated admin passes ?all=1)
router.get('/', async (req, res) => {
  try {
    const isAdmin = Boolean(req.session && req.session.adminId);
    const filter = isAdmin && req.query.all ? {} : { published: true };
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(testimonials);
  } catch (err) {
    console.error('[testimonials/list]', err);
    res.status(500).json({ error: 'Failed to load testimonials.' });
  }
});

// POST /api/testimonials  (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, role, quote, roleAr, quoteAr, avatarInitials, rating, published, order } = req.body || {};
    if (!name || !role || !quote) {
      return res.status(400).json({ error: 'name, role and quote are required.' });
    }
    const initials = avatarInitials || name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const testimonial = await Testimonial.create({
      name, role, quote, roleAr, quoteAr, avatarInitials: initials, rating, published, order,
    });
    res.status(201).json(testimonial);
  } catch (err) {
    console.error('[testimonials/create]', err);
    res.status(400).json({ error: err.message || 'Failed to create testimonial.' });
  }
});

// PUT /api/testimonials/:id  (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const fields = ['name', 'role', 'quote', 'roleAr', 'quoteAr', 'avatarInitials', 'rating', 'published', 'order'];
    const update = {};
    for (const f of fields) if (f in (req.body || {})) update[f] = req.body[f];

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json(testimonial);
  } catch (err) {
    console.error('[testimonials/update]', err);
    res.status(400).json({ error: err.message || 'Failed to update testimonial.' });
  }
});

// DELETE /api/testimonials/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid testimonial id.' });
  }
});

module.exports = router;
