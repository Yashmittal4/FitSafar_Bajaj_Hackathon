import React from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import o2 from "../../assets/images/o7.jpg"

function About() {
  return (
    <>
     <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h2 className="text-4xl font-bold mb-6">About FitTrack</h2>
                <p className="text-xl text-gray-600 mb-8">
                  FitTrack was born from a passion for health and a vision of accessible fitness for all. Our team of fitness
                  enthusiasts and tech experts came together to create a comprehensive solution that empowers individuals on
                  their wellness journey.
                </p>
                <ul className="space-y-4">
                  {[
                    'Founded in 2020',
                    'Over 1 million active users',
                    'Partnered with 500+ fitness professionals',
                    'Continuously evolving with user feedback',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {item}
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
                  src={o2}
                  alt="About FitTrack"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-10 -left-10 bg-purple-600 text-white p-8 rounded-lg shadow-xl">
                  <p className="text-3xl font-bold">1M+</p>
                  <p className="text-xl">Active Users</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      
    </>
  )
}

export default About
