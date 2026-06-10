function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if user has the allowed role
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied: insufficient privileges' });
    }
    
    next();
  };
}

module.exports = requireRole;
