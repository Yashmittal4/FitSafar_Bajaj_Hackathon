


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useNavigate } from "react-router-dom"
import { Trophy, Users, ShoppingBag, Dumbbell, Award, Flame, Target, Zap, ChevronDown, ChevronUp } from "lucide-react"
import CountUp from "react-countup"
import { useAuth } from "../../Context/AuthContext"
import axios from "axios"

const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-gray-700"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-blue-500"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="text-2xl font-bold fill-current text-white">
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  )
}

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [isStatsExpanded, setIsStatsExpanded] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/api/user-progress", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserProgress(response.data.progress)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user progress:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchUserProgress()
    }
  }, [user])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  const isDesktop = windowWidth >= 1024

  const levelProgress = (userProgress?.clearedLevels?.length || 0) / 100 * 100

  const stats = [
    { 
      icon: Dumbbell, 
      label: "Total Pushups", 
      value: userProgress?.exercises?.pushups?.count || 0, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      icon: Target, 
      label: "Total Squats", 
      value: userProgress?.exercises?.squats?.count || 0, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      icon: Zap, 
      label: "Calories Burned", 
      value: userProgress?.stats?.totalCaloriesBurnt || 0, 
      color: "from-orange-500 to-red-500" 
    },
    { 
      icon: Award, 
      label: "Levels Cleared", 
      value: userProgress?.clearedLevels?.length || 0, 
      color: "from-emerald-500 to-green-500" 
    },
    { 
      icon: Flame, 
      label: "Current Streak", 
      value: userProgress?.stats?.currentStreak || 0, 
      color: "from-yellow-500 to-orange-500" 
    },
    { 
      icon: Users, 
      label: "Total XP", 
      value: userProgress?.stats?.totalXP || 0, 
      color: "from-indigo-500 to-blue-500" 
    },
  ]

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-4 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mt-14 mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-6"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl"
            >
              <Trophy size={24} className="text-white" />
            </motion.div>
            <CountUp 
              end={userProgress?.stats?.totalXP || 0} 
              duration={2} 
              className="text-2xl lg:text-3xl font-bold text-white" 
            />
          </div>
          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-xl"
            >
              <CountUp 
                end={userProgress?.stats?.totalCoins || 0} 
                duration={2} 
                className="text-lg lg:text-xl font-bold text-white" 
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2 rounded-xl"
            >
              <CountUp 
                end={userProgress?.stats?.highestStreak || 0} 
                duration={2} 
                className="text-lg lg:text-xl font-bold text-white" 
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="lg:flex lg:gap-8">
          <motion.div
            ref={ref}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl lg:w-1/3 mb-8 lg:mb-0"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-1"
                >
                  <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-2xl font-bold text-white mb-1"
                  >
                    {user?.name || "Warrior"}
                  </motion.h2>
                  <div className="flex items-center gap-2">
                    <Flame className="text-orange-500" size={16} />
                    <span className="text-orange-400">Level {Math.floor((userProgress?.stats?.totalXP || 0) / 100) + 1}</span>
                  </div>
                  {user.weight && user.height ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Dumbbell className="text-blue-500" size={16} />
                    <span className="text-blue-400">
                      BMI:{" "}
                      {(
                        user.weight /
                        (user.height / 100) ** 2
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm mt-2">BMI data not available</span>
                )}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <ProgressRing progress={levelProgress} />
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/levels")}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                >
                  Start Training
                </motion.button>

                
                <div className="grid grid-cols-3 gap-4">
  {[
    { icon: Users, label: "Leaderboard", path: "/leaderboard" },
    { icon: ShoppingBag, label: "Shop", path: "/shop" },
    { icon: Trophy, label: "Achievements", path: "/social" },
  ].map((btn, i) => (
    <motion.button
      key={i}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate(btn.path)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
    >
      <btn.icon size={24} />
      <span className="text-xs">{btn.label}</span>
    </motion.button>
  ))}
</div>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-2/3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {stats.slice(0, isDesktop ? stats.length : isStatsExpanded ? stats.length : 4).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl text-white`}
                >
                  <stat.icon size={20} className="mb-2" />
                  <CountUp end={stat.value} duration={2} className="text-2xl font-bold block" />
                  <span className="text-sm opacity-80">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
            {!isDesktop && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="mt-4 w-full py-2 bg-white/10 rounded-xl text-white flex items-center justify-center"
              >
                {isStatsExpanded ? <ChevronUp /> : <ChevronDown />}
                <span className="ml-2">{isStatsExpanded ? "Show Less" : "Show More"}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile