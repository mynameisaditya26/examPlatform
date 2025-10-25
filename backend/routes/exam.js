const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: 'No auth' });
  const token = h.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (e) { res.status(401).json({ message: 'Invalid token' }); }
}

router.post('/submit', authMiddleware, upload.single('recording'), async (req, res) => {
  try {
    const userId = req.userId;
    const { examId, meta } = req.body;
    // meta expected as JSON string
    let metaObj = {};
    try { metaObj = JSON.parse(meta || '{}'); } catch (e) {}
    const filePath = req.file ? req.file.path : null;
    const sub = await Submission.create({
      user: userId,
      examId,
      filePath,
      meta: metaObj
    });
    res.json({ ok: true, submissionId: sub._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/submissions', authMiddleware, async (req, res) => {
  const list = await Submission.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
