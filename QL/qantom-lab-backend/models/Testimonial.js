const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    quote: { type: String, required: true, trim: true, maxlength: 500 },
    roleAr: { type: String, trim: true, maxlength: 100, default: '' },
    quoteAr: { type: String, trim: true, maxlength: 500, default: '' },
    avatarInitials: { type: String, trim: true, maxlength: 4, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
