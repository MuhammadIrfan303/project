import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProperty } from '../contexts/PropertyContext'
import PropertySearchFilters from '../components/properties/PropertySearchFilters'
import PropertyCard from '../components/properties/PropertyCard'

// MUI Icons
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import SortIcon from '@mui/icons-material/Sort'
import FilterListIcon from '@mui/icons-material/FilterList'

const PropertySearchPage = () => {
  const { properties, loading, searchProperties } = useProperty()
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  useEffect(() => {
    // Set page title
    document.title = 'Search Properties | RealEstate Hub'
    
    // Initialize search from URL params
    const initialFilters = {
      location: searchParams.get('location') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      propertyType: searchParams.get('type') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      minArea: searchParams.get('minArea') || '',
      maxArea: searchParams.get('maxArea') || '',
      amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
    }
    
    if (!loading) {
      handleSearch(initialFilters)
    }
  }, [loading, searchParams])
  
  const handleSearch = (filters) => {
    const results = searchProperties(filters)
    setSearchResults(results)
  }
  
  const handleSort = (option) => {
    setSortOption(option)
    
    const sortedResults = [...searchResults]
    
    switch (option) {
      case 'newest':
        sortedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        sortedResults.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'price-asc':
        sortedResults.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedResults.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    
    setSearchResults(sortedResults)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container-custom mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background-light dark:bg-gray-900">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Property</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our extensive collection of properties and find your dream home.
          </p>
        </div>
        
        {/* Mobile Filters Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-3 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300"
          >
            <FilterListIcon className="mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Search Filters - Mobile */}
        <div className={`md:hidden ${showMobileFilters ? 'block' : 'hidden'}`}>
          <PropertySearchFilters onSearch={handleSearch} />
        </div>
        
        {/* Search Filters - Desktop */}
        <div className="hidden md:block">
          <PropertySearchFilters onSearch={handleSearch} />
        </div>
        
        {/* Results Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
            <span className="font-semibold">{searchResults.length}</span> properties found
          </p>
          
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <SortIcon className="text-gray-500 dark:text-gray-400" />
                <select
                  value={sortOption}
                  onChange={(e) => handleSort(e.target.value)}
                  className="bg-transparent text-gray-700 dark:text-gray-300 pr-8 py-1 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 border-l border-gray-300 dark:border-gray-700 pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                aria-label="Grid view"
              >
                <GridViewIcon className="text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                aria-label="List view"
              >
                <ViewListIcon className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {searchResults.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
          }>
            {searchResults.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search filters to find more properties.
            </p>
            <button
              onClick={() => handleSearch({})}
              className="btn-primary py-2 px-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertySearchPage