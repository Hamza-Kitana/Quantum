const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
// Without this, queries made while there's no database would hang instead of failing.
mongoose.set('bufferCommands', false);

function isDbConfigured() {
  const uri = process.env.MONGO_URI;
  return Boolean(uri) && !uri.includes('<');
}

async function connectDB() {
  if (!isDbConfigured()) {
    console.warn('[db] MONGO_URI is not set — running without a database. Admin login works; content changes are not saved.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[db] Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
}

module.exports = connectDB;
module.exports.isDbConfigured = isDbConfigured;
