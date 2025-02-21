import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronDown, Save, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';

const exerciseTypes = ['BicepCurl', 'Planks', 'Pushups', 'JumpingJack', 'Squats'];
const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

const Admin = () => {
  const [levels, setLevels] = useState([]);
  const [editingLevel, setEditingLevel] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', difficulty: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    levelNumber: '',
    aim: '',
    exercises: [],
    difficulty: 'beginner',
    rewards: {
      coins: 50,
      xp: 25
    }
  });

  useEffect(() => {
    fetchLevels();
  }, [currentPage, filters]);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/levels?page=${currentPage}&limit=10${
          filters.status ? `&status=${filters.status}` : ''
        }${filters.difficulty ? `&difficulty=${filters.difficulty}` : ''}`
      );
      setLevels(response.data.levels);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setError('Failed to fetch levels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setError('');
    setFormData({
      levelNumber: '',
      aim: '',
      exercises: [],
      difficulty: 'beginner',
      rewards: {
        coins: 50,
        xp: 25
      }
    });
    setShowCreateForm(true);
    setEditingLevel(null);
  };

  const handleEdit = (level) => {
    setError('');
    setEditingLevel(level.levelNumber);
    setFormData({
      levelNumber: level.levelNumber,
      aim: level.aim,
      exercises: level.exercises,
      difficulty: level.difficulty,
      rewards: level.rewards
    });
    setShowCreateForm(false);
  };

  const handleAddExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: exerciseTypes[0], reps: 0, duration: 0, calories: 0 }
      ]
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'name' ? value : Number(value)
    };
    setFormData(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingLevel) {
        await axios.post(`http://localhost:5000/api/levels/${editingLevel}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/levels', formData);
      }
      
      fetchLevels();
      setShowCreateForm(false);
      setEditingLevel(null);
      setFormData({
        levelNumber: '',
        aim: '',
        exercises: [],
        difficulty: 'beginner',
        rewards: { coins: 50, xp: 25 }
      });
    } catch (error) {
      console.error('Error saving level:', error);
      setError(error.response?.data?.message || 'Error saving level');
    }
  };

  const handleDelete = async (levelNumber) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        await axios.delete(`http://localhost:5000/api/levels/${levelNumber}`);
        fetchLevels();
      } catch (error) {
        console.error('Error deleting level:', error);
        setError('Failed to delete level');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Level Management</h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-4 py-2 bg-green-500 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Level
            </motion.button>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="bg-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="bg-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">All Difficulties</option>
              {difficultyLevels.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        
        {(showCreateForm || editingLevel) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Level Number</label>
                  <input
                    type="number"
                    value={formData.levelNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, levelNumber: e.target.value }))}
                    disabled={!!editingLevel}
                    className={`w-full bg-gray-700 rounded-lg px-4 py-2 ${editingLevel ? 'opacity-50' : ''}`}
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  >
                    {difficultyLevels.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2">Level Aim</label>
                <textarea
                  value={formData.aim}
                  onChange={(e) => setFormData(prev => ({ ...prev, aim: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  rows={3}
                  placeholder="Enter the goal or objective for this level"
                />
              </div>

              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-semibold">Exercises</label>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="px-3 py-1 bg-blue-500 rounded-lg text-sm"
                  >
                    Add Exercise
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 bg-gray-700 p-4 rounded-lg">
                      <select
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="bg-gray-600 rounded-lg px-3 py-2"
                      >
                        {exerciseTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        className="bg-gray-600 rounded-lg px-3 py-2"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Duration (seconds)"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                        className="bg-gray-600 rounded-lg px-3 py-2"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Calories"
                        value={exercise.calories}
                        onChange={(e) => handleExerciseChange(index, 'calories', e.target.value)}
                        className="bg-gray-600 rounded-lg px-3 py-2"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedExercises = formData.exercises.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, exercises: updatedExercises }));
                        }}
                        className="bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Coins Reward</label>
                  <input
                    type="number"
                    value={formData.rewards.coins}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rewards: { ...prev.rewards, coins: Number(e.target.value) }
                    }))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-2">XP Reward</label>
                  <input
                    type="number"
                    value={formData.rewards.xp}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rewards: { ...prev.rewards, xp: Number(e.target.value) }
                    }))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingLevel(null);
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  {editingLevel ? 'Save Changes' : 'Create Level'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            levels.map(level => (
              <motion.div
                key={level.levelNumber}
                layout
                className="bg-gray-800 rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Level {level.levelNumber}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        level.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {level.status}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {level.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(level)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(level.levelNumber)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {level.aim && (
                  <p className="mt-4 text-gray-400">{level.aim}</p>
                )}

                <div className="mt-4 space-y-2">
                  {level.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-4 text-gray-300">
                      <span className="font-medium">{exercise.name}</span>
                      <span>Reps: {exercise.reps}</span>
                      {exercise.duration > 0 && <span>Duration: {exercise.duration}s</span>}
                      <span>Calories: {exercise.calories}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-4 text-sm">
                  <span className="text-yellow-400">Coins: {level.rewards.coins}</span>
                  <span className="text-blue-400">XP: {level.rewards.xp}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;