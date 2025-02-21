

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

import { Menu, X, ChevronDown, Instagram, Facebook, Twitter, Youtube, ArrowRight, Dumbbell, Droplet, Apple, Pill, Calendar, Activity, Heart, Zap, Trophy, Users, Star, Clock, Smartphone, Phone, Mail, MapPin, Lock } from 'lucide-react'
import o1 from "../../assets/images/a10.jpg"
import o2 from "../../assets/images/o7.jpg"

import o11 from "../../assets/images/ph2.jpg"
import Hero from "./Hero"
import Feature from "./Feature"
import About from "./About"
import Stats from "./Stats"
import Testimonial from "./Testimonial"
import Community from "./Community"
import Price from "./Price"
import Blog from "./Blog"

import Reviews from "./Reviews"




export default function Home() {
    const [activeFeature, setActiveFeature] = useState(0)





  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 z-50 bg-purple-600 transform-origin-0" style={{ scaleX }} />
      <main className="pt-16">
       
       
    <Hero/>
    <Feature/>
    <About/>
    <Stats/>
<<<<<<< HEAD
    <Reviews/>
=======
>>>>>>> 12157af7018df910f72c4b7f36829b7cf4249d01
    <Testimonial/>
    <Community/>
    <Price/>
    <Blog/>

        <section id="app-preview" className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Experience FitTrack in Action
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h3 className="text-3xl font-bold mb-6">Intuitive Design, Powerful Features</h3>
                <p className="text-xl text-gray-600 mb-8">
                  Our user-friendly interface puts all the tools you need at your fingertips. From workout tracking to nutrition analysis, FitTrack makes managing your fitness journey a breeze.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <Smartphone className="w-6 h-6 text-purple-600" />, text: 'Available on iOS and Android' },
                    { icon: <Zap className="w-6 h-6 text-purple-600" />, text: 'Sync across all your devices' },
                    { icon: <Users className="w-6 h-6 text-purple-600" />, text: 'Connect with friends and trainers' },
                    { icon: <Lock className="w-6 h-6 text-purple-600" />, text: 'Bank-level data security' },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      {item.icon}
                      <span className="ml-2">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 relative"
              >
                <img
                  src={o11}
                  alt="FitTrack App Preview"
                  className="rounded-3xl shadow-2xl mx-auto"
                />
                <div className="absolute -top-10 -right-10 bg-yellow-400 text-gray-900 p-4 rounded-full shadow-xl">
                  <Star className="w-8 h-8" />
                  <p className="font-bold">4.9 Rating</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Get in Touch
            </motion.h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-purple-600 text-white p-8">
                  <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                  <p className="mb-4">Fill out the form and our team will get back to you within 24 hours.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Phone className="w-6 h-6 mr-2" />
                      <span>+1 (555) 123-4567</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="w-6 h-6 mr-2" />
                      <span>support@fittrack.com</span>
                    </li>
                    <li className="flex items-center">
                      <MapPin className="w-6 h-6 mr-2" />
                      <span>123 Fitness Street, Healthy City, 12345</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 p-8">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea id="message" name="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition duration-300">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-8"
            >
              Ready to Transform Your Fitness Journey?
            </motion.h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              Join FitTrack today and take the first step towards a healthier, stronger you. Start your free trial now and experience the difference!
            </p>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
            >
              Start Your Free Trial
            </motion.a>
          </div>
        </section>
      </main>    
    </div>
  )};