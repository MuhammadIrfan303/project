import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProperty } from '../../contexts/PropertyContext'
import { useAuth } from '../../contexts/AuthContext'

// MUI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const PropertyCard = ({ property }) => {
  const { toggleSaveProperty, savedProperties } = useProperty()
  const { currentUser } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  const isSaved = savedProperties.includes(property.id)

  const handleSaveToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (currentUser) {
      toggleSaveProperty(property.id)
    } else {
      // Redirect to login or show login modal
      alert('Please login to save properties')
    }
  }

  const formatPrice = (price) => {
    return property.status === 'for-rent'
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`
  }

  return (
    <Link to={`/properties/${property.id}`}>
      <motion.div
        className="card overflow-hidden h-full"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Property Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'for-rent'
                ? 'bg-secondary text-white'
                : 'bg-primary text-white'
              }`}>
              {property.status === 'for-rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          >
            {isSaved ? (
              <FavoriteIcon className="text-red-500" />
            ) : (
              <FavoriteBorderIcon className="text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Price */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 px-3 py-1 rounded-md">
            <span className="text-white font-semibold">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {property.title}
          </h3>

          <div className="flex items-center mb-3 text-gray-600 dark:text-gray-400">
            <LocationOnIcon fontSize="small" className="mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <BedIcon fontSize="small" className="mr-1" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <BathtubIcon fontSize="small" className="mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <SquareFootIcon fontSize="small" className="mr-1" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          </div>

          {/* Property Type */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {property.type}
            </span>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(property.createdAt.seconds * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default PropertyCard