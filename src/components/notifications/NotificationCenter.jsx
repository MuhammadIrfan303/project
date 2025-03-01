import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotification } from '../../contexts/NotificationContext'

// MUI Icons
import NotificationsIcon from '@mui/icons-material/Notifications'
import CloseIcon from '@mui/icons-material/Close'
import MessageIcon from '@mui/icons-material/Message'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Badge from '@mui/material/Badge'

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotification()
  
  const [isOpen, setIsOpen] = useState(false)
  
  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.notification-center') && !e.target.closest('.notification-toggle')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])
  
  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen)
  }
  
  const handleNotificationClick = (id) => {
    markAsRead(id)
  }
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageIcon className="text-blue-500" />
      case 'property':
        return <HomeIcon className="text-green-500" />
      case 'system':
        return <InfoIcon className="text-purple-500" />
      default:
        return <InfoIcon className="text-gray-500" />
    }
  }
  
  return (
    <div className="fixed top-20 right-4 z-40">
      {/* Notification Toggle Button */}
      <button
        className="notification-toggle p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleNotificationCenter}
        aria-label="Notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon className="text-gray-700 dark:text-gray-300" />
        </Badge>
      </button>
      
      {/* Notification Center */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="notification-center absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-700 p-3 flex justify-between items-center">
              <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary dark:text-primary-light hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={toggleNotificationCenter}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1" onClick={() => handleNotificationClick(notification.id)}>
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        aria-label="Delete notification"
                      >
                        <CloseIcon fontSize="small" />
                      </button>
                    </div>
                    {notification.read && (
                      <div className="flex justify-end mt-1">
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <CheckCircleIcon fontSize="small" className="mr-1 text-green-500" />
                          Read
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter