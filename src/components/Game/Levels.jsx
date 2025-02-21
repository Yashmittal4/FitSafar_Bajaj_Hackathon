"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  Lock, ChevronLeft, Trophy, Star, Gift, Flame, 
  Dumbbell, AlertCircle, ChevronDown, ChevronUp, Play 
} from "lucide-react"
import axios from 'axios'
import { useAuth } from "../../Context/AuthContext"

const LevelCard = ({ level, isHovered, setHoveredLevel, clearedLevels }) => {
  const navigate = useNavigate()
  const [showAllExercises, setShowAllExercises] = useState(false)
  
  // A level is unlocked if it's in the first 3 levels OR if the previous level is cleared
  const isUnlocked = level.levelNumber <= 3 || 
                     clearedLevels?.includes(level.levelNumber - 1)

  const handleStartLevel = (levelNumber) => {
    navigate(`/exercise/${levelNumber}`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHoveredLevel(level.levelNumber)}
      onHoverEnd={() => setHoveredLevel(null)}
      className={`
        relative rounded-2xl
        ${
          isUnlocked
            ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10"
            : "bg-gray-800/50 border border-gray-700/50"
        }
      `}
    >
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />

      <div className="relative flex flex-col h-[450px]">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold mb-1">Level {level.levelNumber}</h3>
          {isUnlocked ? (
            <div className="flex items-center gap-2">
              {clearedLevels?.includes(level.levelNumber) ? (
                <>
                  <Trophy className="text-yellow-500" size={16} />
                  <span className="text-yellow-400">Completed</span>
                </>
              ) : level.status === 'pending' ? (
                <>
                  <AlertCircle className="text-yellow-500" size={16} />
                  <span className="text-yellow-400">Work in Progress</span>
                </>
              ) : (
                <>
                  <Flame className="text-orange-500" size={16} />
                  <span className="text-orange-400">Ready to Start</span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Lock size={16} />
              <span>Locked</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {isUnlocked && level.status === 'active' ? (
            <>
              {level.aim && (
                <div className="px-6 py-3 border-b border-white/10">
                  <p className="text-gray-300 text-sm">{level.aim}</p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-3 custom-scrollbar">
                <div className="space-y-2">
                  {level.exercises?.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-black/20 rounded-lg p-2"
                    >
                      <span className="text-gray-300 font-medium">{exercise.name}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {exercise.reps > 0 && (
                          <span className="bg-gray-700/50 px-2 py-1 rounded">
                            {exercise.reps} reps
                          </span>
                        )}
                        {exercise.duration > 0 && (
                          <span className="bg-gray-700/50 px-2 py-1 rounded">
                            {exercise.duration}s
                          </span>
                        )}
                        <span className="bg-gray-700/50 px-2 py-1 rounded">
                          {exercise.calories} cal
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="text-yellow-500" size={16} />
                      <span className="text-yellow-400">{level.rewards.coins} coins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="text-blue-500" size={16} />
                      <span className="text-blue-400">{level.rewards.xp} XP</span>
                    </div>
                  </div>
                </div>
                
                {!clearedLevels?.includes(level.levelNumber) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartLevel(level.levelNumber)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    <Play size={16} />
                    Start Level
                  </motion.button>
                )}
              </div>
            </>
          ) : level.unlocked && level.status === 'pending' ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Dumbbell className="mx-auto mb-4 text-yellow-500 animate-pulse" size={32} />
                <p className="text-gray-400 text-sm">Stay fit and healthy!</p>
                <p className="text-gray-500 text-xs mt-2">Coming soon...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Lock className="mx-auto mb-4 text-gray-500" size={32} />
                <p className="text-gray-400 text-sm">Complete previous level to unlock</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Levels = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const containerRef = useRef(null)
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userProgress, setUserProgress] = useState(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "start start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const [levelsResponse, progressResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/levels?limit=100'),
          axios.get('http://localhost:5000/api/user-progress', config)
        ]);
        
        setLevels(levelsResponse.data.levels);
        setUserProgress(progressResponse.data.progress);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Loading levels...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-hidden">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            <span className="text-xl font-bold">{userProgress?.stats?.totalCoins || 0}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ scaleY: smoothProgress }}
        className="fixed left-0 top-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500 origin-top"
      />

      <div ref={containerRef} className="pt-24 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <LevelCard
              key={level.levelNumber}
              level={level}
              isHovered={hoveredLevel === level.levelNumber}
              setHoveredLevel={setHoveredLevel}
              clearedLevels={userProgress?.clearedLevels}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Levels