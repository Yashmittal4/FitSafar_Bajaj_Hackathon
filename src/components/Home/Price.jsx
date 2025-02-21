import React,{useState} from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

function Price() {
    const [activePlan, setActivePlan] = useState(1)

    const plans = [
        { name: 'Basic', price: '$9.99', features: ['Workout Tracking', 'Water Tracking', 'Basic Analytics'] },
        { name: 'Pro', price: '$19.99', features: ['All Basic Features', 'Diet Maintenance', 'Advanced Analytics', 'Personal Coach'] },
        { name: 'Ultimate', price: '$29.99', features: ['All Pro Features', 'Personalized Meal Plans', 'VIP Support', 'Exclusive Content'] },
      ]
  return (
    <>
     <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Choose Your Perfect Plan
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white p-8 rounded-lg shadow-md border-2 ${
                    index === activePlan ? 'border-purple-500 transform scale-105' : 'border-gray-200'
                  }`}
                  onMouseEnter={() => setActivePlan(index)}
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-base font-normal">/month</span></p>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-full font-semibold transition duration-300 ${
                    index === activePlan
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}>
                    Choose Plan
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      
    </>
  )
}

export default Price
