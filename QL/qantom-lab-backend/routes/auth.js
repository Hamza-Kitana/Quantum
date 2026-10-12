const express = require('express');
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force login attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in a few minutes.' },
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const envUser = (process.env.ADMIN_USERNAME || '').trim();
    const envPass = (process.env.ADMIN_PASSWORD || '').trim();
    if (!envUser || !envPass || username.trim() !== envUser || password !== envPass) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const signIn = () => {
      req.session.adminId = envUser;
      req.session.username = envUser;
      res.json({ ok: true, username: envUser });
    };

    // Cookie sessions (no database) have no server-side session to regenerate.
    if (typeof req.session.regenerate !== 'function') return signIn();

    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Login failed. Try again.' });
      signIn();
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  if (typeof req.session.destroy !== 'function') {
    req.session = null;
    return res.json({ ok: true });
  }
  req.session.destroy(() => {
    res.clearCookie('qlab.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.session.username });
});

module.exports = router;
