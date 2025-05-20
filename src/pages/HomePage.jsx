import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VillaIcon from '@mui/icons-material/Villa';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { mockTestimonials } from '../data/mockData';

const HomePage = () => {
  const [categories, setCategories] = useState({});
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add this object at the top of your component, after the imports
  const cityImages = {
    'Karachi': 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg',
    'Lahore': 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg',
    'Islamabad': 'https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg',
    'Rawalpindi': 'https://images.pexels.com/photos/2846220/pexels-photo-2846220.jpeg',
    'Faisalabad': 'https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg',
    'Peshawar': 'https://images.pexels.com/photos/2869217/pexels-photo-2869217.jpeg',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesRef = collection(db, 'Properties');
        const snapshot = await getDocs(propertiesRef);

        // Count properties by city
        const cityCount = {};
        snapshot.docs.forEach(doc => {
          const city = doc.data().address;
          if (city) {
            cityCount[city] = (cityCount[city] || 0) + 1;
          }
        });

        // Convert to array and sort by count
        const citiesData = Object.entries(cityCount)
          .map(([name, count]) => ({
            name,
            count,
            image: `/images/cities/${name.toLowerCase()}.jpg` // You'll need to add these images
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Get top 6 cities

        setCities(citiesData);

        const fetchPropertyTypes = async () => {
          try {
            const propertiesRef = collection(db, 'Properties');
            const snapshot = await getDocs(propertiesRef);

            const typeCount = {
              house: 0,
              apartment: 0,
              commercial: 0,
              land: 0
            };

            snapshot.docs.forEach(doc => {
              const type = doc.data().type;
              if (type && typeCount.hasOwnProperty(type)) {
                typeCount[type]++;
              }
            });

            setCategories(typeCount);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching property types:', error);
            setLoading(false);
          }
        };

        fetchPropertyTypes();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = 'RealEstate Hub | Find Your Dream Property'
  }, [])





  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Similar to pakrealestate.com */}
      <HeroSection />



      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Property Categories - Similar to pakrealestate.com */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse By Category</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find the perfect property that matches your needs
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center cursor-pointer"
              >
                <HomeIcon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Houses</h3>
                <p className="text-gray-600 dark:text-gray-400">{categories.house || 0} Properties</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center cursor-pointer"
              >
                <ApartmentIcon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Apartments</h3>
                <p className="text-gray-600 dark:text-gray-400">{categories.apartment || 0} Properties</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center cursor-pointer"
              >
                <LocationCityIcon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Commercial</h3>
                <p className="text-gray-600 dark:text-gray-400">{categories.commercial || 0} Properties</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center cursor-pointer"
              >
                <LandscapeIcon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Land</h3>
                <p className="text-gray-600 dark:text-gray-400">{categories.land || 0} Properties</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Cities</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (


            // Update the cities mapping section
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {cities.map((city, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="relative rounded-lg overflow-hidden shadow-md cursor-pointer h-32"
                >
                  <img
                    src={cityImages[city.name] || `https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg`}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-2">
                    <h3 className="text-white text-lg font-bold text-center">{city.name}</h3>
                    <p className="text-white text-sm">{city.count} Properties</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What our clients say about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
                <div className="flex mt-4 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Similar to pakrealestate.com */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Looking to Buy or Sell Property?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our expert agents are ready to assist you with all your real estate needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/contact"
              className="bg-white text-primary hover:bg-gray-100 py-3 px-8 text-lg rounded-md font-medium"
            >
              Contact Us
            </a>
            <a
              href="/properties"
              className="border-2 border-white text-white hover:bg-white hover:text-primary py-3 px-8 text-lg rounded-md font-medium"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>


    </div>
  )
}

export default HomePage