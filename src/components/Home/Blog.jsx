import React from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import o8 from "../../assets/images/o5.jpg"
import o9 from "../../assets/images/a1.jpg"
import o10 from "../../assets/images/k4.jpg"
function Blog() {
  return (
    <>
     <section id="blog" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Latest from Our Blog
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: '10 Tips for Effective Weight Loss', category: 'Nutrition', image: o8 },
                { title: 'The Ultimate Full-Body Workout Routine', category: 'Fitness', image: o9 },
                { title: 'Mindfulness and Its Impact on Fitness', category: 'Wellness', image: o10 },
              ].map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-purple-600 font-semibold text-sm">{post.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-4">{post.title}</h3>
                    <a href="#" className="text-purple-600 font-semibold hover:underline">Read More</a>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <a href="#" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition duration-300">
                View All Posts
              </a>
            </div>
          </div>
        </section>
      
    </>
  )
}

export default Blog
