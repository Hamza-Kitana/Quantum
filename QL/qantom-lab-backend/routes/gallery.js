const express = require('express');
const GalleryItem = require('../models/GalleryItem');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/gallery  (public: published only, unless authenticated admin passes ?all=1)
router.get('/', async (req, res) => {
  try {
    const isAdmin = Boolean(req.session && req.session.adminId);
    const filter = isAdmin && req.query.all ? {} : { published: true };
    const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('[gallery/list]', err);
    res.status(500).json({ error: 'Failed to load gallery items.' });
  }
});

// POST /api/gallery  (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, titleAr, descriptionAr, category, imageUrl, published, order } = req.body || {};
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required.' });
    }
    const item = await GalleryItem.create({ title, description, titleAr, descriptionAr, category, imageUrl, published, order });
    res.status(201).json(item);
  } catch (err) {
    console.error('[gallery/create]', err);
    res.status(400).json({ error: err.message || 'Failed to create gallery item.' });
  }
});

// PUT /api/gallery/:id  (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const fields = ['title', 'description', 'titleAr', 'descriptionAr', 'category', 'imageUrl', 'published', 'order'];
    const update = {};
    for (const f of fields) if (f in (req.body || {})) update[f] = req.body[f];

    const item = await GalleryItem.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Gallery item not found.' });
    res.json(item);
  } catch (err) {
    console.error('[gallery/update]', err);
    res.status(400).json({ error: err.message || 'Failed to update gallery item.' });
  }
});

// DELETE /api/gallery/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid gallery item id.' });
  }
});

module.exports = router;
