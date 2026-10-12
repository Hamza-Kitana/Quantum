// Require an authenticated admin session. Attach as middleware to any
// route that only the admin panel should be able to reach.
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

module.exports = { requireAuth };
