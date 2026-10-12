const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    titleAr: { type: String, trim: true, maxlength: 120, default: '' },
    descriptionAr: { type: String, trim: true, maxlength: 600, default: '' },
    icon: { type: String, default: '💠', trim: true, maxlength: 8 }, // emoji shown in admin + (optionally) on site
    duration: { type: String, required: true, trim: true, maxlength: 40 }, // e.g. "12 Weeks"
    durationAr: { type: String, trim: true, maxlength: 40, default: '' }, // e.g. "12 أسبوع"
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    // Matches the public site's course filter bar buckets exactly.
    category: {
      type: String,
      enum: ['ai', 'xr', 'engines', 'hardware', 'programming', 'webdesign', 'secdata'],
      default: 'programming',
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
