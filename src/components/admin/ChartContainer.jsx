import { useState } from 'react'
import { motion } from 'framer-motion'

const ChartContainer = ({ title, children, filters = false }) => {
  const [timeRange, setTimeRange] = useState('7d')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        
        {filters && (
          <div className="mt-2 sm:mt-0">
            <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '7d'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '30d'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                30d
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '90d'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                90d
              </button>
              <button
                onClick={() => setTimeRange('1y')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '1y'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                1y
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  )
}

export default ChartContainer