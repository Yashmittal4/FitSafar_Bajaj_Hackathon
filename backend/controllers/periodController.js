const Period = require('../models/Period');

exports.getPeriodData = async (req, res) => {
  try {
    const periodData = await Period.findOne({ userId: req.userId });
    
    if (!periodData) {
      // Instead of 404, return empty data with status 200
      return res.status(200).json({
        quizCompleted: false,
        lastPeriodDate: new Date(),
        cycleDuration: 28,
        periodDuration: 5,
        mood: null,
        symptoms: []
      });
    }

    res.json(periodData);
  } catch (error) {
    console.error('Error in getPeriodData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createOrUpdatePeriodData = async (req, res) => {
  try {
    const { lastPeriodDate, cycleDuration, periodDuration, mood, symptoms } = req.body;

    let periodData = await Period.findOne({ userId: req.userId });

    if (periodData) {
      // Update existing data
      periodData.lastPeriodDate = lastPeriodDate;
      periodData.cycleDuration = cycleDuration;
      periodData.periodDuration = periodDuration;
      periodData.mood = mood;
      periodData.symptoms = symptoms;
      periodData.quizCompleted = true;
      periodData.updatedAt = Date.now();
    } else {
      // Create new period data
      periodData = new Period({
        userId: req.userId,
        lastPeriodDate,
        cycleDuration,
        periodDuration,
        mood,
        symptoms,
        quizCompleted: true
      });
    }

    await periodData.save();
    res.json(periodData);
  } catch (error) {
    console.error('Error in createOrUpdatePeriodData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

