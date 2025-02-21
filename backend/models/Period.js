const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  lastPeriodDate: {
    type: Date,
    required: true
  },
  cycleDuration: {
    type: Number,
    required: true,
    default: 28
  },
  periodDuration: {
    type: Number,
    required: true,
    default: 5
  },
  quizCompleted: {
    type: Boolean,
    default: false
  },
  mood: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', null],
    default: null
  },
  symptoms: [{
    type: String,
    enum: ['Cramps', 'Bloating', 'Fatigue', 'Cravings']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Period', periodSchema);


