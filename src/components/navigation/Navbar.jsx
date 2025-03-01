import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNotification } from '../../contexts/NotificationContext'
import { useChat } from '../../contexts/ChatContext'

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ChatIcon from '@mui/icons-material/Chat'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Badge from '@mui/material/Badge'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotification()
  const { getTotalUnreadCount, toggleChatWidget } = useChat()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (

    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white dark:bg-gray-900 shadow-md py-2'
          : 'bg-transparent py-4'
        }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary dark:text-white">
              RealEstate<span className="text-secondary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`nav-link ${location.pathname.includes('/properties') ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Properties
            </Link>
            <Link
              to="/#about"
              className="nav-link text-gray-700 dark:text-gray-300"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="nav-link text-gray-700 dark:text-gray-300"
            >
              Contact
            </Link>
          </nav>

          {/* Search, Theme Toggle, Notifications, Chat, and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-60 py-2 pl-3 pr-10 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 dark:text-gray-400"
              >
                <SearchIcon fontSize="small" />
              </button>
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <LightModeIcon className="text-yellow-400" />
              ) : (
                <DarkModeIcon className="text-gray-700" />
              )}
            </button>

            {currentUser && (
              <>
                {/* Notifications */}
                <Link
                  to="/profile?tab=notifications"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Notifications"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon className="text-gray-700 dark:text-gray-300" />
                  </Badge>
                </Link>

                {/* Chat */}
                <button
                  onClick={toggleChatWidget}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Chat"
                >
                  <Badge badgeContent={getTotalUnreadCount()} color="error">
                    <ChatIcon className="text-gray-700 dark:text-gray-300" />
                  </Badge>
                </button>
              </>
            )}

            {/* Auth Buttons or Profile */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <AccountCircleIcon className="text-gray-700 dark:text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser.displayName || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>

                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="container-custom mx-auto py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-3 pr-10 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 dark:text-gray-400"
                  >
                    <SearchIcon fontSize="small" />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`py-2 ${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  Home
                </Link>
                <Link
                  to="/properties"
                  className={`py-2 ${location.pathname.includes('/properties') ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  Properties
                </Link>
                <Link
                  to="/#about"
                  className="py-2 text-gray-700 dark:text-gray-300"
                >
                  About
                </Link>
                <Link
                  to="/#contact"
                  className="py-2 text-gray-700 dark:text-gray-300"
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile Auth or Profile */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {currentUser ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <AccountCircleIcon fontSize="large" className="text-gray-700 dark:text-gray-300" />
                      )}
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    >
                      Profile
                    </Link>

                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="py-2 text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="w-full py-2 text-center font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-2 text-center font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Theme Toggle */}
              <div className="mt-6 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <LightModeIcon className="text-yellow-400" />
                  ) : (
                    <DarkModeIcon className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar