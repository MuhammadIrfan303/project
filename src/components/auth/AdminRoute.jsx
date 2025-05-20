
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Check if user exists and has admin role
    if (!currentUser || currentUser.role !== 'admin') {
        // Redirect to login with the attempted location
        return <Navigate to="/" state={{ from: location }} replace />
    }

    // If admin, allow access to admin routes
    return children
}

export default AdminRoute
