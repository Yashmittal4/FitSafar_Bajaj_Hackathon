const calculateAverageCycleLength = (history) => {
    if (history.length < 2) return null;
    
    const cycles = [];
    for (let i = 1; i < history.length; i++) {
      const daysDiff = Math.floor(
        (new Date(history[i].date) - new Date(history[i-1].date)) / (1000 * 60 * 60 * 24)
      );
      cycles.push(daysDiff);
    }
    
    return Math.round(cycles.reduce((a, b) => a + b) / cycles.length);
  };
  
  const getCommonSymptoms = (history) => {
    const symptomCount = {};
    
    history.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
      });
    });
    
    return Object.entries(symptomCount)
      .sort(([,a], [,b]) => b - a)
      .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
      }), {});
  };
  
  const analyzeMoodPatterns = (history) => {
    const moodPatterns = {};
    
    history.forEach(entry => {
      if (entry.mood) {
        moodPatterns[entry.mood] = (moodPatterns[entry.mood] || 0) + 1;
      }
    });
    
    return moodPatterns;
  };
  
  const calculateCyclePhase = (lastPeriodDate, cycleDuration) => {
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24));
    const currentCycleDay = (daysSinceLastPeriod % cycleDuration) + 1;
  
    if (currentCycleDay <= 5) return 'menstrual';
    if (currentCycleDay <= 14) return 'follicular';
    if (currentCycleDay <= 17) return 'ovulatory';
    return 'luteal';
  };
  
  const getPhaseRecommendations = (phase) => {
    const recommendations = {
      menstrual: [
        'Stay hydrated and rest well',
        'Apply warm compress for cramps',
        'Practice gentle yoga or stretching',
        'Eat iron-rich foods',
        'Take warm baths for relaxation'
      ],
      follicular: [
        'Great time for high-intensity workouts',
        'Start new projects or set goals',
        'Increase social activities',
        'Focus on learning new skills',
        'Plan important meetings'
      ],
      ovulatory: [
        'Channel your peak energy into creativity',
        'Perfect time for important presentations',
        'Engage in team activities',
        'Try challenging workouts',
        'Schedule important social events'
      ],
      luteal: [
        'Focus on self-care activities',
        'Practice mindfulness and meditation',
        'Opt for gentle exercise like walking',
        'Prepare nutritious comfort foods',
        'Get extra rest if needed'
      ]
    };
  
    return recommendations[phase] || recommendations.follicular;
  };
  
  module.exports = {
    calculateAverageCycleLength,
    getCommonSymptoms,
    analyzeMoodPatterns,
    calculateCyclePhase,
    getPhaseRecommendations
  };