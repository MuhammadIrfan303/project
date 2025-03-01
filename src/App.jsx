import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from './contexts/ThemeContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import HomePage from './pages/HomePage'
import PropertySearchPage from './pages/PropertySearchPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'
// import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminPropertiesPage from './pages/admin/PropertiesPage'
import AdminUsersPage from './pages/admin/UsersPage'
// import AdminAnalyticsPage from './pages/admin/AnalyticsPage'
// import NotFoundPage from './pages/NotFoundPage'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import ChatWidget from './components/chat/ChatWidget'
import NotificationCenter from './components/notifications/NotificationCenter'
import ScrollToTop from './components/common/ScrollToTop'
import PropertyEditForm from './components/admin/PropertyEditForm'

function App() {
  const location = useLocation()
  const { theme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="properties" element={<PropertySearchPage />} />
            <Route path="properties/:id" element={<PropertyDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            {/* <Route path="register" element={<RegisterPage />} /> */}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="profile" element={<ProfilePage />} /> */}
            </Route>

            {/* Admin Routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboardPage />} />
              <Route path="properties" element={<AdminPropertiesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="propertyEdit/:id" element={<PropertyEditForm />} /> 
              {/* <Route path="analytics" element={<AdminAnalyticsPage />} /> */}
            </Route>

            {/* 404 Route */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Routes>
      </AnimatePresence>

      {/* Global Components */}
      <ChatWidget />
      <NotificationCenter />
    </div>
  )
}

export default App