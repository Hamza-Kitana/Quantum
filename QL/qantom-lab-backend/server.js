require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const cookieSession = require('cookie-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');
const { isDbConfigured } = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const testimonialRoutes = require('./routes/testimonials');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const faqRoutes = require('./routes/faq');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

connectDB();

// Security headers. CSP is relaxed for inline <script>/<style> and Google
// Fonts/Maps since the public site is a single self-contained index.html.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        frameSrc: ["'self'", 'https://www.google.com'],
        connectSrc: ["'self'"],
      },
    },
  })
);

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: clientOrigins.length ? clientOrigins : true,
    credentials: true,
  })
);

app.set('trust proxy', 1);

const sessionSecret = process.env.SESSION_SECRET || 'dev-secret-change-me';
const sessionMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

if (isDbConfigured()) {
  app.use(
    session({
      name: 'qlab.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: sessionMaxAge / 1000,
      }),
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: sessionMaxAge,
      },
    })
  );
} else {
  // Serverless hosts (e.g. Vercel) don't keep memory between requests,
  // so without a database the session lives in a signed cookie instead.
  app.use(
    cookieSession({
      name: 'qlab.sid',
      keys: [sessionSecret],
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: sessionMaxAge,
    })
  );
}

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) =>
  res.json({
    ok: true,
    time: new Date().toISOString(),
    adminLoginConfigured: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
  })
);

// ---- Static frontend (public site) + admin panel ----
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// 404 fallback for anything else under the public site
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Centralized error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`[server] Qantom Lab backend running on http://localhost:${PORT}`);
  console.log(`[server] Public site:  http://localhost:${PORT}/`);
  console.log(`[server] Admin panel:  http://localhost:${PORT}/admin`);
});
