import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import { FaChartBar, FaUsers, FaBuilding, FaBell, FaUserPlus, FaBlog } from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const sidebarLinks = [
    { path: '/admin', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/admin/properties', label: 'Properties', icon: <FaBuilding /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { path: '/admin/add-agent', label: 'Add Agent', icon: <FaUserPlus /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/admin/blogs', label: 'Blog Management', icon: <FaBlog /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout;