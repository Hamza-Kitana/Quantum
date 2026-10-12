const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 1500 },
    questionAr: { type: String, trim: true, maxlength: 300, default: '' },
    answerAr: { type: String, trim: true, maxlength: 1500, default: '' },
    topic: {
      type: String,
      enum: ['courses', 'registration', 'certificates', 'schedule', 'fees', 'online'],
      required: true,
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);
