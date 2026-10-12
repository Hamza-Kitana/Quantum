const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    titleAr: { type: String, trim: true, maxlength: 100, default: '' },
    descriptionAr: { type: String, trim: true, maxlength: 400, default: '' },
    category: {
      type: String,
      trim: true,
      maxlength: 40,
      default: 'General',
    },
    imageUrl: { type: String, trim: true, default: '' }, // optional external image URL
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
