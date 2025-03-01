import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '../../components/admin/StatCard'
import ChartContainer from '../../components/admin/ChartContainer'

// MUI Icons
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MessageIcon from '@mui/icons-material/Message'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Admin Dashboard | RealEstate Hub'
  }, [])
  
  // Mock data for charts
  const renderBarChart = () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-full flex items-end justify-around px-4">
        {[65, 40, 80, 55, 95, 70, 45].map((height, index) => (
          <div key={index} className="relative group" style={{ height: '100%' }}>
            <div 
              className="w-8 bg-primary bg-opacity-80 rounded-t-md hover:bg-opacity-100 transition-all duration-200"
              style={{ height: `${height}%` }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 text-center mt-2 text-xs text-gray-600 dark:text-gray-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {height}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderLineChart = () => (
    <div className="h-full w-full flex items-center">
      <svg viewBox="0 0 400 100" className="w-full h-full">
        <path
          d="M0,50 Q50,20 100,40 T200,60 T300,30 T400,50"
          fill="none"
          stroke="#3730A3"
          strokeWidth="3"
        />
        <path
          d="M0,80 Q50,60 100,70 T200,80 T300,60 T400,70"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
        />
        <g>
          <circle cx="0" cy="50" r="3" fill="#3730A3" />
          <circle cx="100" cy="40" r="3" fill="#3730A3" />
          <circle cx="200" cy="60" r="3" fill="#3730A3" />
          <circle cx="300" cy="30" r="3" fill="#3730A3" />
          <circle cx="400" cy="50" r="3" fill="#3730A3" />
        </g>
        <g>
          <circle cx="0" cy="80" r="3" fill="#059669" />
          <circle cx="100" cy="70" r="3" fill="#059669" />
          <circle cx="200" cy="80" r="3" fill="#059669" />
          <circle cx="300" cy="60" r="3" fill="#059669" />
          <circle cx="400" cy="70" r="3" fill="#059669" />
        </g>
      </svg>
    </div>
  )
  
  const renderPieChart = () => (
    <div className="h-full w-full flex items-center justify-center">
      <svg width="150" height="150" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="transparent" 
          stroke="#3730A3" 
          strokeWidth="10" 
          strokeDasharray="283" 
          strokeDashoffset="70" 
          transform="rotate(-90 50 50)" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="transparent" 
          stroke="#059669" 
          strokeWidth="10" 
          strokeDasharray="283" 
          strokeDashoffset="200" 
          transform="rotate(-90 50 50)" 
          strokeLinecap="round"
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#1f2937" className="dark:text-white">75%</text>
      </svg>
      <div className="ml-8 space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">For Sale (65%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">For Rent (35%)</span>
        </div>
      </div>
    </div>
  )
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Properties"
          value="124"
          icon={<HomeWorkIcon className="text-blue-600 dark:text-blue-400" />}
          color="blue"
          percentChange={12.5}
          timeFrame="last month"
        />
        <StatCard
          title="Total Users"
          value="1,893"
          icon={<PeopleIcon className="text-green-600 dark:text-green-400" />}
          color="green"
          percentChange={8.2}
          timeFrame="last month"
        />
        <StatCard
          title="Page Views"
          value="45.2K"
          icon={<VisibilityIcon className="text-purple-600 dark:text-purple-400" />}
          color="purple"
          percentChange={-3.8}
          timeFrame="last month"
        />
        <StatCard
          title="Total Revenue"
          value="$12,450"
          icon={<AttachMoneyIcon className="text-yellow-600 dark:text-yellow-400" />}
          color="yellow"
          percentChange={24.3}
          timeFrame="last month"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Weekly Property Views" filters={true}>
          {renderBarChart()}
        </ChartContainer>
        
        <ChartContainer title="User Registrations & Inquiries" filters={true}>
          {renderLineChart()}
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartContainer title="Property Distribution">
          {renderPieChart()}
        </ChartContainer>
        
        <div className="lg:col-span-2">
          <ChartContainer title="Recent Activity">
            <div className="h-full overflow-y-auto">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { type: 'message', user: 'John Doe', action: 'sent a message about', target: 'Modern Apartment in Downtown', time: '5 minutes ago' },
                  { type: 'property', user: 'Admin', action: 'added a new property', target: 'Luxury Villa with Ocean View', time: '2 hours ago' },
                  { type: 'user', user: 'Sarah Johnson', action: 'registered as a new user', time: '3 hours ago' },
                  { type: 'property', user: 'Admin', action: 'updated property', target: 'Cozy Suburban Family Home', time: '5 hours ago' },
                  { type: 'view', user: 'Michael Brown', action: 'viewed property', target: 'Modern Loft in Arts District', time: '6 hours ago' },
                ].map((activity, index) => (
                  <li key={index} className="py-3">
                    <div className="flex items-start">
                      <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'message' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-400' :
                        activity.type === 'property' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400' :
                        activity.type === 'user' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-400' :
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400'
                      }`}>
                        {activity.type === 'message' ? <MessageIcon fontSize="small" /> :
                         activity.type === 'property' ? <HomeWorkIcon fontSize="small" /> :
                         activity.type === 'user' ? <PeopleIcon fontSize="small" /> :
                         <VisibilityIcon fontSize="small" />}
                      </span>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{activity.user}</span> {activity.action} 
                          {activity.target && <span className="font-medium"> {activity.target}</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ChartContainer>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Conversion Rate
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                3.6% <TrendingUpIcon className="ml-1 text-green-500" fontSize="small" />
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '36%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inquiry Response Rate
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                92% <TrendingUpIcon className="ml-1 text-green-500" fontSize="small" />
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                User Retention
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                78% <TrendingUpIcon className="ml-1 text-green-500" fontSize="small" />
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Property Listing Growth
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                15% <TrendingUpIcon className="ml-1 text-green-500" fontSize="small" />
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage