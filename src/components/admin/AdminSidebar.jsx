import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'
import { FaUsers, FaBuilding, FaBell, FaUserPlus, FaBlog } from 'react-icons/fa';
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useAuth } from '../../contexts/AuthContext'

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth()

  const sidebarVariants = {
    open: {
      width: '240px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: '70px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const navItems = [
    { path: '/admin', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/admin/properties', icon: <HomeWorkIcon />, label: 'Properties' },
    { path: '/admin/users', icon: <PeopleIcon />, label: 'Users' },
    { path: '/admin/advisiors', icon: <FaUsers size={20} />, label: 'Advisiors' },

    { path: '/admin/blogs', icon: <BarChartIcon />, label: 'Blogs' },

  ]

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      className={`h-screen bg-gray-800 text-white flex flex-col z-20 ${isOpen ? 'w-60' : 'w-20'} transition-all duration-300`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl"
            >
              Admin Panel
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <ChevronLeftIcon style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Visit Website Button - Add this before the Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center w-full p-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <HomeIcon />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Visit Website
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full p-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <LogoutIcon />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

export default AdminSidebar
