const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: u._id }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: u._id, name: u.name, email: u.email }});
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: 'Invalid' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid' });
    const token = jwt.sign({ id: u._id }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: u._id, name: u.name, email: u.email }});
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
