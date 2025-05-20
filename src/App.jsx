import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from './contexts/ThemeContext'
// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import PropertySearchPage from './pages/PropertySearchPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminPropertiesPage from './pages/admin/PropertiesPage'
import AdminUsersPage from './pages/admin/UsersPage'


import BlogManagement from './pages/admin/BlogManagement'
import AdminRoute from './components/auth/AdminRoute'
import ScrollToTopButton from './components/common/ScrollToTopButton'

import BlogsPage from './pages/blogspage'
import BlogPost from './pages/blogpost'

import PropertyEditForm from './components/admin/PropertyEditForm'
import AddAdvisor from './pages/admin/AddAdvisor'
import AdvisiorManagement from './pages/admin/AdvisiorManagement'
import PropertyAdvisor from './pages/agents/PropertyAdvisor'
import AddPropertiesAdvisor from './pages/agents/AddPropertiesAdvisor'
import AdvisorPage from './pages/agents/AdvisorPage'
import AdvisorProfile from './pages/agents/AdvisorProfile'
import ProfilePage from './pages/profilepage'

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
      <ScrollToTopButton />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path='Register' element={<RegisterPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path="properties" element={<PropertySearchPage />} />
            <Route path="properties/:id" element={<PropertyDetailsPage />} />
            <Route path='/advisor' element={<AdvisorPage />} />
            <Route path='/advisor/:id' element={<AdvisorProfile />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path='/advisor/Dashbord' element={<PropertyAdvisor />} />
            <Route path='advisor/add-property' element={<AddPropertiesAdvisor />} />
            <Route path='/propertyEdit/:id' element={<PropertyEditForm />} />
            {/* Admin Routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboardPage />} />
              <Route path="properties" element={<AdminPropertiesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="add-advisior" element={<AddAdvisor />} />
              <Route path="advisiors" element={<AdvisiorManagement />} />


              <Route path="blogs" element={<BlogManagement />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App

