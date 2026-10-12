const mongoose = require('mongoose');

// Singleton document — there is only ever one SiteSettings row.
const siteSettingsSchema = new mongoose.Schema(
  {
    contactEmail: { type: String, trim: true, default: '' },
    contactPhone: { type: String, trim: true, default: '' }, // display format, e.g. "+962 7 8232 8748"
    whatsappNumber: { type: String, trim: true, default: '' }, // digits only, e.g. "962782328748"
    whatsappMessage: { type: String, trim: true, default: '' },
    whatsappMessageAr: { type: String, trim: true, default: '' },
    social: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
    },
    stats: {
      students: { type: String, trim: true, default: '500+' },
      courses: { type: String, trim: true, default: '30+' },
      projects: { type: String, trim: true, default: '20+' },
      satisfaction: { type: String, trim: true, default: '95%' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
