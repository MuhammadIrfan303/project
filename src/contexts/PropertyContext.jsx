import { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary

const PropertyContext = createContext();

export const useProperty = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Set up real-time listener
    const propertiesCollection = collection(db, 'Properties');
    const unsubscribe = onSnapshot(propertiesCollection, (snapshot) => {
      try {
        // Map the documents to property objects
        const propertiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Update properties state
        setProperties(propertiesData);

        // Update featured properties
        const featured = propertiesData.filter(property => property.featured);
        setFeaturedProperties(featured);

        setLoading(false);
      } catch (error) {
        console.error('Error processing properties:', error);
        setLoading(false);
      }
    }, (error) => {
      console.error('Snapshot listener error:', error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getPropertyById = (id) => {
    return properties.find(property => property.id === id) || null;
  };

  const searchProperties = (filters) => {
    // Add search to history
    if (filters && Object.keys(filters).length > 0) {
      setSearchHistory(prev => [
        { id: Date.now(), filters, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only the 10 most recent searches
      ]);
    }

    // Apply filters
    return properties.filter(property => {
      let match = true;

      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        match = false;
      }

      if (filters.minPrice && property.price < filters.minPrice) {
        match = false;
      }

      if (filters.maxPrice && property.price > filters.maxPrice) {
        match = false;
      }

      if (filters.propertyType && property.type !== filters.propertyType) {
        match = false;
      }

      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        match = false;
      }

      if (filters.bathrooms && property.bathrooms < filters.bathrooms) {
        match = false;
      }

      return match;
    });
  };

  const toggleSaveProperty = (propertyId) => {
    setSavedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const value = {
    properties,
    featuredProperties,
    loading,
    savedProperties,
    searchHistory,
    getPropertyById,
    searchProperties,
    toggleSaveProperty,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};