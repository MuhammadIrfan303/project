import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProperty } from '../../contexts/PropertyContext'
import PropertyCard from '../properties/PropertyCard'

const FeaturedProperties = () => {
  const { featuredProperties, loading } = useProperty()
  const [visibleProperties, setVisibleProperties] = useState([])

  useEffect(() => {
    if (!loading && featuredProperties.length > 0) {
      // Show up to 3 featured properties
      setVisibleProperties(featuredProperties.slice(0, 3))
    }
  }, [featuredProperties, loading])

  if (loading) {
    return (
      <section className="py-16 bg-background-light dark:bg-gray-900">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Loading our featured properties...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  if (visibleProperties.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-background-light dark:bg-gray-900">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties that stand out for their exceptional features and value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/properties" 
            className="btn-primary py-3 px-8"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties