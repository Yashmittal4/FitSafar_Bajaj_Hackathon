import React, {  useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import o1 from "../../assets/images/a10.jpg"
import { Menu, X, ChevronDown, Instagram, Facebook, Twitter, Youtube, ArrowRight, Dumbbell, Droplet, Apple, Pill, Calendar, Activity, Heart, Zap, Trophy, Users, Star, Clock, Smartphone, Phone, Mail, MapPin, Lock } from 'lucide-react'

const ParallaxSection = ({ children, speed = 0.5 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
    return (
      <motion.div ref={ref} style={{ y, position: "absolute", inset: 0 }}>
        {children}
      </motion.div>
    );
  };
function Hero() {
  return (
    <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParallaxSection speed={0.2}>
        <div className="absolute inset-0 z-0">
          <img src={o1} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 opacity-60"></div>
        </div>
      </ParallaxSection>

  
      <div className="container mx-auto px-4 z-10 text-white text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Revolutionize Your<br />Fitness Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
        >
          FitTrack: The ultimate fitness companion that adapts to your unique needs.
          Track, analyze, and optimize your health like never before.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <a
            href="#features"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
          >
            Discover Features
          </a>
          <a
            href="#pricing"
            className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </a>
        </motion.div>
      </div>

     
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-12 h-12 text-white" />
      </div>
    </section>
      
    </>
  )
}

export default Hero
