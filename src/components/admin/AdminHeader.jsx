import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Badge from '@mui/material/Badge'

const AdminHeader = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 flex items-center justify-between">
      {/* Left side - Menu toggle and title */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none z-10"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        {/* <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
          Admin Dashboard
        </h1> */}
      </div>

      {/* Right side - Actions */}

    </header>
  )
}

export default AdminHeader