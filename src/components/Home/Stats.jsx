import React from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

const StatCard = ({ label, value, suffix = '' }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    })
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-purple-800 p-6 rounded-lg text-center"
      >
        <h3 className="text-2xl font-bold mb-2">
          {inView ? (
            <CountUp end={value} duration={2.5} separator="," />
          ) : (
            '0'
          )}
          {suffix}
        </h3>
        <p className="text-purple-200">{label}</p>
      </motion.div>
    )
  }

function Stats() {
  return (
    <>
    <section id="stats" className="py-20 bg-purple-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', value: 1000000, suffix: '+' },
                { label: 'Workouts Tracked', value: 50000000, suffix: '+' },
                { label: 'Weight Lost (lbs)', value: 2000000, suffix: '+' },
                { label: 'App Downloads', value: 5000000, suffix: '+' },
              ].map((stat, index) => (
                <StatCard key={index} label={stat.label} value={stat.value} suffix={stat.suffix} />
              ))}
            </div>
          </div>
        </section>
      
    </>
  )
}

export default Stats
