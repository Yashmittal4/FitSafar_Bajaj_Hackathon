'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../Context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Heart, Smile, Frown, Meh, Sun, Moon, Cloud, Droplets, Coffee, Utensils, Bell, Edit } from 'lucide-react'

const MOODS = [
  { icon: Smile, label: 'Happy', color: 'text-yellow-500' },
  { icon: Meh, label: 'Neutral', color: 'text-gray-500' },
  { icon: Frown, label: 'Sad', color: 'text-blue-500' },
]

const SYMPTOMS = [
  { icon: Droplets, label: 'Cramps' },
  { icon: Cloud, label: 'Bloating' },
  { icon: Coffee, label: 'Fatigue' },
  { icon: Utensils, label: 'Cravings' },
]

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']

export default function Period() {
  const { user } = useAuth()
  const [showQuiz, setShowQuiz] = useState(false)
  const [periodData, setPeriodData] = useState(null)
  const [lastPeriod, setLastPeriod] = useState(new Date())
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [mood, setMood] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [periodHistory, setPeriodHistory] = useState([])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (user?.gender === 'female') {
      fetchPeriodData()
    }
  }, [user])

  const fetchPeriodData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/period/data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data) {
        setPeriodData(response.data)
        setShowQuiz(!response.data.quizCompleted)
        setLastPeriod(new Date(response.data.lastPeriodDate))
        setCycleLength(response.data.cycleDuration)
        setPeriodLength(response.data.periodDuration)
        setMood(response.data.mood)
        setSymptoms(response.data.symptoms || [])
        updatePeriodHistory()
      }
    } catch (error) {
      console.error('Error fetching period data:', error)
      if (error.response?.status !== 404) {
        toast.error('Error fetching period data')
      }
    }
  }


  const handleQuizSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:5000/api/period/data',
        {
          lastPeriodDate: lastPeriod,
          cycleDuration: cycleLength,
          periodDuration: periodLength,
          mood,
          symptoms
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setPeriodData(response.data)
      setShowQuiz(false)
      toast.success('Period data saved successfully!')
      updatePeriodHistory()
    } catch (error) {
      console.error('Error saving period data:', error)
      toast.error('Error saving period data')
    }
  }

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/period/data', 
        {
          lastPeriodDate: lastPeriod,
          cycleDuration: cycleLength,
          periodDuration: periodLength
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPeriodData(response.data)
      setEditMode(false)
      updatePeriodHistory(lastPeriod, cycleLength, periodLength)
      toast.success('Period data updated successfully!')
    } catch (error) {
      toast.error('Error updating period data')
    }
  }

  const updatePeriodHistory = (startDate, cycle, duration) => {
    const newHistory = []
    let currentDate = new Date(startDate)
    for (let i = 0; i < 6; i++) {
      newHistory.push({
        start: new Date(currentDate),
        end: new Date(currentDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000)
      })
      currentDate = new Date(currentDate.getTime() + cycle * 24 * 60 * 60 * 1000)
    }
    setPeriodHistory(newHistory)
  }

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const getRecommendations = () => {
    const recommendations = [
      "Stay hydrated! Aim for 8 glasses of water a day.",
      "Try some light exercise like yoga or walking.",
      "Eat foods rich in iron and omega-3 fatty acids.",
      "Use a heating pad for cramp relief.",
      "Get plenty of rest and prioritize self-care.",
    ]
    return recommendations[Math.floor(Math.random() * recommendations.length)]
  }

  const calculateNextPeriod = () => {
    if (!periodData) return null
    const nextPeriod = new Date(lastPeriod)
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength)
    return nextPeriod
  }

  const getDaysUntilNextPeriod = () => {
    const nextPeriod = calculateNextPeriod()
    if (!nextPeriod) return null
    const today = new Date()
    return Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24))
  }

  if (user?.gender !== 'female') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">This feature is only available for female users.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">Period Tracker</h1>
          
          {showQuiz ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Initial Setup</h2>
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Period Start Date
                  </label>
                  <DatePicker
                    selected={lastPeriod}
                    onChange={(date) => setLastPeriod(date)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Cycle Length (days)
                  </label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="21"
                    max="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Period Length (days)
                  </label>
                  <input
                    type="number"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="3"
                    max="7"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Start Tracking
                </button>
              </form>
            </motion.div>
          ) : (
            <div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-pink-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Next Period</h3>
                  <p>{calculateNextPeriod()?.toDateString()}</p>
                  <p className="text-sm text-gray-600">
                    {getDaysUntilNextPeriod()} days away
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Cycle Length</h3>
                  <p>{cycleLength} days</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Period Length</h3>
                  <p>{periodLength} days</p>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Period Start Date
                    </label>
                    <DatePicker
                      selected={lastPeriod}
                      onChange={(date) => setLastPeriod(date)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Cycle Length (days)
                    </label>
                    <input
                      type="number"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="21"
                      max="35"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Period Length (days)
                    </label>
                    <input
                      type="number"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="3"
                      max="7"
                    />
                  </div>
                  <button
                    onClick={handleEditSubmit}
                    className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="mb-8 flex items-center text-purple-600 hover:text-purple-800"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Details
                </button>
              )}

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Heart className="mr-2 text-red-500" /> Mood & Symptoms
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How are you feeling today?
                      </label>
                      <div className="flex justify-around">
                        {MOODS.map((m) => (
                          <button
                            key={m.label}
                            onClick={() => setMood(m.label)}
                            className={`p-2 rounded-full ${
                              mood === m.label ? 'bg-purple-100' : ''
                            }`}
                          >
                            <m.icon className={`w-8 h-8 ${m.color}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptoms
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {SYMPTOMS.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => toggleSymptom(s.label)}
                            className={`p-2 rounded-md flex items-center ${
                              symptoms.includes(s.label)
                                ? 'bg-pink-200'
                                : 'bg-gray-100'
                            }`}
                          >
                            <s.icon className="mr-2 w-5 h-5" />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-4 bg-purple-50 rounded-lg"
                >
                  <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sun className="mr-2 text-yellow-500" /> Daily Tip
                  </h2>
                  <p className="text-gray-700">{getRecommendations()}</p>
                </motion.div>

                {showNotification && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-pink-100 rounded-lg flex items-center"
                  >
                    <Bell className="mr-4 text-pink-500" />
                    <p className="text-pink-800">
                      Your period is coming soon! Make sure you're prepared.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}



