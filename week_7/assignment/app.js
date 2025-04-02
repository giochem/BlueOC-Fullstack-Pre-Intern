const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const secretKey = 'my-secret-key'; // Use a secure key in production

// Middleware to parse JSON requests
app.use(express.json());

// Temporary in-memory database
let users = [];
let nextId = 1;

// Helper function to exclude password from responses
const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach decoded token (id, role) to request
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can perform this action' });
  }
  next();
};

// Validation rules for creating a user
const validateUser = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().custom((value) => {
    if (users.find(user => user.email === value)) {
      throw new Error('Email already in use');
    }
    return true;
  }),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
];

// Validation rules for updating a user
const validateUpdateUser = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('email').optional().isEmail().custom((value, { req }) => {
    const existingUser = users.find(u => u.email === value && u.id !== parseInt(req.params.id));
    if (existingUser) {
      throw new Error('Email already in use');
    }
    return true;
  }),
  body('password').optional().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
];

// Create a new user
app.post('/users', validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  const newUser = { id: nextId++, name, email, password, role };
  users.push(newUser);
  res.status(201).json(omitPassword(newUser));
});

// Login and get JWT token
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Get all users (authenticated users only)
app.get('/users', authenticateToken, (req, res) => {
  res.json(users.map(omitPassword));
});

// Get a specific user by ID (authenticated users only)
app.get('/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(omitPassword(user));
});

// Update a user (user can update own info, admin can update any)
app.put('/users/:id', authenticateToken, validateUpdateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check permissions: User can update own info, or admin can update any
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You do not have permission to update this user' });
  }

  const { name, email, password, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (role && req.user.role === 'admin') {
    user.role = role; // Only admins can change roles
  } else if (role) {
    return res.status(403).json({ message: 'Only admins can change roles' });
  }

  res.json(omitPassword(user));
});

// Delete a user (admin only)
app.delete('/users/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send(); // No content
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});