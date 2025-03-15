import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import UserTable from '../../components/admin/UserTable'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
// import UserForm from '../../components/admin/UserForm'

// MUI Icons
// import AddIcon from '@mui/icons-material/Add'

// Mock user data

const UsersPage = () => {
  const [users, setUsers] = useState([])

  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    document.title = 'Manage Users | Admin Dashboard'
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const timer = setTimeout(() => {
          setUsers(usersList)
          setIsLoading(false)
        }, 500)
        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchUsers();
  }, []);




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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and monitor registered user accounts and their activity across the platform.
          </p>
        </div>

        {/* <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          <AddIcon className="mr-1" />
          Add User
        </button> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >

        <UserTable
          users={users}

        />

      </motion.div>
    </div>
  )
}

export default UsersPage