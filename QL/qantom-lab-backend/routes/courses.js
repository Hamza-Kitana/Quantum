const express = require('express');
const Course = require('../models/Course');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses  (public: published only, unless authenticated admin passes ?all=1)
router.get('/', async (req, res) => {
  try {
    const isAdmin = Boolean(req.session && req.session.adminId);
    const filter = isAdmin && req.query.all ? {} : { published: true };
    const courses = await Course.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(courses);
  } catch (err) {
    console.error('[courses/list]', err);
    res.status(500).json({ error: 'Failed to load courses.' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Invalid course id.' });
  }
});

// POST /api/courses  (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, titleAr, descriptionAr, icon, duration, durationAr, difficulty, category, published, order } = req.body || {};
    if (!title || !description || !duration) {
      return res.status(400).json({ error: 'title, description and duration are required.' });
    }
    const course = await Course.create({
      title, description, titleAr, descriptionAr, icon, duration, durationAr, difficulty, category, published, order,
    });
    res.status(201).json(course);
  } catch (err) {
    console.error('[courses/create]', err);
    res.status(400).json({ error: err.message || 'Failed to create course.' });
  }
});

// PUT /api/courses/:id  (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const fields = ['title', 'description', 'titleAr', 'descriptionAr', 'icon', 'duration', 'durationAr', 'difficulty', 'category', 'published', 'order'];
    const update = {};
    for (const f of fields) if (f in (req.body || {})) update[f] = req.body[f];

    const course = await Course.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course);
  } catch (err) {
    console.error('[courses/update]', err);
    res.status(400).json({ error: err.message || 'Failed to update course.' });
  }
});

// DELETE /api/courses/:id  (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid course id.' });
  }
});

module.exports = router;
