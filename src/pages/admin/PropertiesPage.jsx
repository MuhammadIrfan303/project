import { useState, useEffect } from 'react';
import { useProperty } from '../../contexts/PropertyContext';
import PropertyTable from '../../components/admin/PropertyTable';
import PropertyForm from '../../components/admin/PropertyForm';

const PropertiesPage = () => {
  const { properties } = useProperty();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    document.title = 'Manage Properties | Admin Dashboard';

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  




  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all property listings on your platform.
          </p>
        </div>

        <button
          onClick={handleAddProperty}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          {/* <AddIcon className="mr-1" /> */}
          Add Property
        </button>
      </div>

      {showForm ? (

        <PropertyForm
          setShowForm={setShowForm}
      
        />
      ) : (
        <PropertyTable

     
        />
      )}
    </div>
  );
};

export default PropertiesPage;