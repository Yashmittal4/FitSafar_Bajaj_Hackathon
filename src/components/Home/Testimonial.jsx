import React from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import o5 from "../../assets/images/p1.jpg"
import o6 from "../../assets/images/p2.jpg"
import o7 from "../../assets/images/p3.jpg"

function Testimonial() {
  return (
    <>
     <section id="testimonials" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Success Stories
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Fitness Enthusiast',
                  quote: 'FitTrack has completely transformed my fitness journey. The comprehensive tracking features and intuitive interface make it a joy to use every day.',
                  image: o5,
                  achievement: 'Lost 30 lbs in 6 months',
                },
                {
                  name: 'Michael Chen',
                  role: 'Marathon Runner',
                  quote: 'As a serious runner, I need detailed analytics. FitTrack provides everything I need to optimize my training and reach new personal bests.',
                  image: o6,
                  achievement: 'Improved marathon time by 30 minutes',
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Yoga Instructor',
                  quote: 'The meditation and mindfulness features in FitTrack have been a game-changer for my practice. It\'s not just about physical fitness, but overall well-being.',
                  image: o7,
                  achievement: 'Grew online yoga community by 500%',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full inline-block">
                    {testimonial.achievement}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      
    </>
  )
}

export default Testimonial
