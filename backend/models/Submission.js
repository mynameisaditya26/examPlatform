const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  examId: String,
  filePath: String,         // path to recording blob on server
  meta: {                  // metadata collected from client
    tabSwitchCount: Number,
    faceAbsentSeconds: Number,
    highMotionEvents: Number,
    voiceLoudSeconds: Number,
    voiceSilentSeconds: Number,
    durationSeconds: Number,
    computedScore: Number
  },
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
