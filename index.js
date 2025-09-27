const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_super_secret_jwt_key'; // Use a long, random string in production

// --- Middleware ---
app.use(cors());
app.use(express.json()); 

// --- Error Handling ---
const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ error: message });
};

// --- Authentication Routes ---

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { email, fullName, password, role } = req.body;

  if (!email || !fullName || !password || !role) {
    return sendError(res, 'All fields are required for registration.');
  }
  if (!['citizen', 'official', 'analyst', 'admin'].includes(role)) {
    return sendError(res, 'Invalid user role specified.');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return sendError(res, 'Server error during password hashing.', 500);
    }

    const sql = 'INSERT INTO Users (email, fullName, password, role) VALUES (?, ?, ?, ?)';
    db.run(sql, [email, fullName, hashedPassword, role], function(err) {
      if (err) {
        return sendError(res, 'Email already in use.');
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required.');
  }

  const sql = 'SELECT * FROM Users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      return sendError(res, 'Server error during login.', 500);
    }
    if (!user) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return sendError(res, 'Invalid credentials.', 401);
      }
      
      const { password, ...userProfile } = user;

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '3h' });
      res.json({ token, user: userProfile });
    });
  });
});

// --- Middleware to Protect Routes ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// --- Protected Routes ---

// GET /api/user/profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const sql = "SELECT id, email, fullName, role FROM Users WHERE id = ?";
  db.get(sql, [req.user.id], (err, user) => {
    if (err || !user) {
      return sendError(res, 'User not found.', 404);
    }
    res.json(user);
  });
});

// --- Server Initialization ---
app.listen(PORT, () => {
  console.log(`Secure backend server running on http://localhost:${PORT}`);
});
