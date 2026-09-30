const jwt = require('jsonwebtoken');

// Authenticate user by checking JWT token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        req.user = user; // Ensure 'role' is included in the 'user' object
        console.log('Authenticated User:', req.user); // Debugging line
        next();
    });
};

// Authorize user based on role
const authorize = (roles) => (req, res, next) => {
    console.log('Required Roles:', roles);  // Log the required roles
    console.log('User Role:', req.user?.role);  // Log the role of the authenticated user

    if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
    }
    next();
};

module.exports = { authenticate, authorize };
