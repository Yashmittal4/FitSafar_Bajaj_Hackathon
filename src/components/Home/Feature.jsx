import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { Menu, X, ChevronDown, Instagram, Facebook, Twitter, Youtube, ArrowRight, Dumbbell, Droplet, Apple, Pill, Calendar, Activity, Heart, Zap, Trophy, Users, Star, Clock, Smartphone, Phone, Mail, MapPin, Lock } from 'lucide-react'
import o1 from "../../assets/images/a10.jpg"

function Feature() {
    const [activeFeature, setActiveFeature] = useState(0)


    
  const features = [
    { icon: <Dumbbell className="w-8 h-8" />, title: 'Workout Tracking', description: 'Log and analyze your workouts with ease' },
    { icon: <Droplet className="w-8 h-8" />, title: 'Water Tracking', description: 'Stay hydrated with smart reminders' },
    { icon: <Apple className="w-8 h-8" />, title: 'Diet Maintenance', description: 'Track your nutrition and reach your goals' },
    { icon: <Pill className="w-8 h-8" />, title: 'Medicine Record', description: 'Never miss a dose with our medication tracker' },
    { icon: <Calendar className="w-8 h-8" />, title: 'Period Tracker', description: 'Monitor your cycle and predict future dates' },
    // { icon: <Activity className="w-8 h-8" />, title: 'Progress Analytics', description: 'Visualize your fitness journey with detailed charts' },
    // { icon: <Heart className="w-8 h-8" />, title: 'Heart Rate Monitoring', description: 'Keep track of your cardiovascular health' },
    // { icon: <Zap className="w-8 h-8" />, title: 'Sleep Analysis', description: 'Improve your sleep quality with in-depth insights' },
  ]
  return (
    <>
    <section id="features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Powerful Features to Transform Your Fitness
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                      activeFeature === index ? 'border-2 border-purple-500' : ''
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="relative h-[600px]">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={o1}
                    alt={features[activeFeature].title}
                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      
    </>
  )
}

export default Feature
