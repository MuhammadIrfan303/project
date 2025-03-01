import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon, color, percentChange, timeFrame }) => {
  const isPositiveChange = percentChange >= 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900 dark:bg-opacity-20`}>
          {icon}
        </div>
      </div>
      
      {percentChange !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            isPositiveChange 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositiveChange ? '+' : ''}{percentChange}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            from {timeFrame}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard