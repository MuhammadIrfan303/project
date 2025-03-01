import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import UserTable from '../../components/admin/UserTable'
import UserForm from '../../components/admin/UserForm'

// MUI Icons
import AddIcon from '@mui/icons-material/Add'

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T10:30:00.000Z',
    lastLogin: '2023-06-20T14:25:00.000Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'agent',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-20T14:45:00.000Z',
    lastLogin: '2023-06-19T09:15:00.000Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'agent',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdAt: '2023-03-10T09:15:00.000Z',
    lastLogin: '2023-06-18T16:30:00.000Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'agent',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    createdAt: '2023-04-05T16:20:00.000Z',
    lastLogin: '2023-06-15T11:45:00.000Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'user',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    createdAt: '2023-05-12T11:30:00.000Z',
    lastLogin: '2023-06-10T08:20:00.000Z'
  },
  {
    id: '6',
    name: 'Jennifer Thompson',
    email: 'jennifer@example.com',
    role: 'user',
    status: 'inactive',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    createdAt: '2023-06-18T13:45:00.000Z',
    lastLogin: null
  }
]

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    document.title = 'Manage Users | Admin Dashboard'
    
    // Simulate API call to fetch users
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }
  
  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }
  
  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }
  
  const handleToggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ))
  }
  
  const handleFormSubmit = (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData } 
          : user
      ))
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: (users.length + 1).toString(),
        createdAt: new Date().toISOString(),
        lastLogin: null
      }
      setUsers([...users, newUser])
    }
    setShowForm(false)
    setEditingUser(null)
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingUser(null)
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions.
          </p>
        </div>
        
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          <AddIcon className="mr-1" />
          Add User
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {showForm ? (
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : (
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </motion.div>
    </div>
  )
}

export default UsersPage