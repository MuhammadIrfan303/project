import { createContext, useContext, useState, useEffect } from 'react'

// Mock Firebase Auth for now - would be replaced with actual Firebase implementation
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Simulate auth state change after 1 second
    setTimeout(() => {
      callback(null)
    }, 1000)
    return () => {}
  },
  signInWithEmailAndPassword: (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'password') {
          mockAuth.currentUser = {
            uid: '1',
            email,
            displayName: 'Admin User',
            photoURL: 'https://via.placeholder.com/150',
            emailVerified: true,
            role: 'admin'
          }
        } else if (email && password) {
          mockAuth.currentUser = {
            uid: '2',
            email,
            displayName: 'Regular User',
            photoURL: 'https://via.placeholder.com/150',
            emailVerified: true,
            role: 'user'
          }
        }
        resolve({ user: mockAuth.currentUser })
      }, 1000)
    })
  },
  createUserWithEmailAndPassword: (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.currentUser = {
          uid: '2',
          email,
          displayName: null,
          photoURL: null,
          emailVerified: false,
          role: 'user'
        }
        resolve({ user: mockAuth.currentUser })
      }, 1000)
    })
  },
  signOut: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.currentUser = null
        resolve()
      }, 1000)
    })
  },
  updateProfile: (user, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.currentUser = { ...mockAuth.currentUser, ...data }
        resolve()
      }, 1000)
    })
  }
}

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      const result = await mockAuth.signInWithEmailAndPassword(email, password)
      setCurrentUser(result.user)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const register = async (email, password, displayName) => {
    try {
      const result = await mockAuth.createUserWithEmailAndPassword(email, password)
      await mockAuth.updateProfile(result.user, { displayName })
      setCurrentUser({ ...result.user, displayName })
      return result.user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await mockAuth.signOut()
      setCurrentUser(null)
    } catch (error) {
      throw error
    }
  }

  const updateUserProfile = async (data) => {
    try {
      await mockAuth.updateProfile(currentUser, data)
      setCurrentUser(prev => ({ ...prev, ...data }))
    } catch (error) {
      throw error
    }
  }

  const isAdmin = () => {
    return currentUser?.role === 'admin'
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}