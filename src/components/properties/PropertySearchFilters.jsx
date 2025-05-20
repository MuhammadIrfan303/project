import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'

const PropertySearchFilters = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: []
  })

  // Available amenities for filtering
  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Elevator', 'Security',
    'Balcony', 'Garden', 'Fireplace', 'Air Conditioning', 'Furnished'
  ]

  // Property types
  const propertyTypes = ['apartment', 'house', 'condo', 'commercial', 'land']

  useEffect(() => {
    // Initialize filters from URL params
    const location = searchParams.get('location') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const propertyType = searchParams.get('type') || ''
    const bedrooms = searchParams.get('bedrooms') || ''
    const bathrooms = searchParams.get('bathrooms') || ''
    const minArea = searchParams.get('minArea') || ''
    const maxArea = searchParams.get('maxArea') || ''
    const amenities = searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []

    setFilters({
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities
    })

    // If there are advanced filters set, show the advanced section
    if (minPrice || maxPrice || bedrooms || bathrooms || minArea || maxArea || amenities.length > 0) {
      setShowAdvanced(true)
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const amenities = [...prev.amenities]

      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter(a => a !== amenity) }
      } else {
        return { ...prev, amenities: [...amenities, amenity] }
      }
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Update URL params
    const params = {}

    if (filters.location) params.location = filters.location
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.propertyType) params.type = filters.propertyType
    if (filters.bedrooms) params.bedrooms = filters.bedrooms
    if (filters.bathrooms) params.bathrooms = filters.bathrooms
    if (filters.minArea) params.minArea = filters.minArea
    if (filters.maxArea) params.maxArea = filters.maxArea
    if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',')

    setSearchParams(params)

    // Call the onSearch callback with the filters
    onSearch(filters)
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: []
    })

    setSearchParams({})
    onSearch({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSearch}>
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="City, neighborhood, or address"
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="w-full md:w-48">
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleInputChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Any Type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary py-3 px-6 flex items-center justify-center"
          >
            <SearchIcon className="mr-2" />
            Search
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary dark:text-primary-light flex items-center text-sm font-medium"
          >
            <FilterListIcon className="mr-1" fontSize="small" />
            {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>

          {(filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms ||
            filters.minArea || filters.maxArea || filters.amenities.length > 0) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center"
              >
                <CloseIcon className="mr-1" fontSize="small" />
                Clear All Filters
              </button>
            )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleInputChange}
                  className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleInputChange}
                  className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Area (sqft)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minArea"
                    value={filters.minArea}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <input
                    type="number"
                    name="maxArea"
                    value={filters.maxArea}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableAmenities.map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`amenity-${amenity}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
}

export default PropertySearchFilters