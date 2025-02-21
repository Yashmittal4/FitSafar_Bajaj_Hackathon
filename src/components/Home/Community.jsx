import React from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

function Community() {
  return (
    <>
        <section className="py-20 bg-purple-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Join Our Thriving Fitness Community
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h3 className="text-3xl font-bold mb-6">Connect, Share, and Grow Together</h3>
                <p className="text-xl mb-8">
                  Join a community of like-minded individuals who are passionate about fitness and personal growth. Share your progress, get inspired, and motivate others on their journey.
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
                >
                  Join Our Community
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 grid grid-cols-3 gap-4"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    src={`/placeholder.svg?height=150&width=150&text=Community ${index}`}
                    alt={`Community ${index}`}
                    className="rounded-lg shadow-md hover:scale-105 transition duration-300"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>
    </>
  )
}

export default Community
