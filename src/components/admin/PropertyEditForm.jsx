

import { useState, useEffect } from 'react';
import { useProperty } from '../../contexts/PropertyContext';
import { collection, addDoc, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path as necessary

// MUI Icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast';
import { Link, Navigate, useNavigate, useNavigation, useParams } from 'react-router-dom';

const PropertyEditForm = () => {
    const { id } = useParams();


    const initialState = {
        title: '',
        description: '',
        price: '',
        type: 'apartment',
        status: 'for-sale',
        bedrooms: '',
        bathrooms: '',
        latitude: '',
        longitude: '',
        area: '',
        location: '',
        address: '',
        images: [],
        amenities: [],
        featured: false,

    };



    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [amenityInput, setAmenityInput] = useState('');
    const navigate = useNavigate();

    // Available amenities for selection
    const availableAmenities = [
        'Swimming Pool', 'Gym', 'Parking', 'Elevator', 'Security',
        'Balcony', 'Garden', 'Fireplace', 'Air Conditioning', 'Furnished'
    ];

    // useEffect(() => {
    //   if (property) {
    //     setFormData(property);
    //   }
    // }, [property]);

    useEffect(() => {
        const getProperty = async () => {
            try {
                const daraReference = doc(db, 'Properties', id);

                const property = await getDoc(daraReference);
                setFormData(property.data());

            } catch (error) {
                console.error('Error fetching property:', error);

            }
        }
        getProperty();
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const amenities = [...prev.amenities];

            if (amenities.includes(amenity)) {
                return { ...prev, amenities: amenities.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...amenities, amenity] };
            }
        });
    };

    const handleAddCustomAmenity = () => {
        if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenityInput.trim()]
            }));
            setAmenityInput('');
        }
    };

    const handleAddImage = () => {
        const placeholderImages = [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
        ];

        const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, randomImage]
        }));
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
        if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
        if (!formData.area) newErrors.area = 'Area is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        if (formData.latitude === "") newErrors.latitude = 'Latitude is required';
        if (formData.longitude === "") newErrors.longitude = 'Longitude is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const loadingToaster = toast.loading("Data is being saved...");



        if (validateForm()) {
            try {
                const propertyData = {
                    ...formData,
                    price: Number(formData.price),
                    bedrooms: Number(formData.bedrooms),
                    bathrooms: Number(formData.bathrooms),
                    area: Number(formData.area),
                    coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates for demo
                    updatedAt: Timestamp.now(),
                };

                const docRef = doc(db, 'Properties', id);
                await updateDoc(docRef, propertyData);
                toast.dismiss(loadingToaster);
                toast.success('Document updated successfully');
                navigate('/admin/properties');
            } catch (error) {
                console.error(error);
                toast.dismiss(loadingToaster);
                toast.error('An error occurred. Please try again.');
            }
        }
    };

    return (
        <form onSubmit={handleAdd} className="space-y-6">
            <Toaster />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Property Title*
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="e.g. Modern Apartment in Downtown"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price*
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.price ? 'border-red-500' : ''}`}
                            placeholder="e.g. 450000"
                            min="0"
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Property Type*
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="condo">Condo</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status*
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="for-sale">For Sale</option>
                            <option value="for-rent">For Rent</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location*
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.location ? 'border-red-500' : ''}`}
                            placeholder="e.g. Downtown, New York"
                        />
                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Address*
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="e.g. 123 Main St, New York, NY 10001"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Latitude
                        </label>
                        <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.latitude ? 'border-red-500' : ''}`}
                            placeholder="latitude"
                        />
                        {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                    </div>

                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Longitude
                        </label>
                        <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.longitude ? 'border-red-500' : ''}`}
                            placeholder="longitude"
                        />
                        {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                            />
                            Featured Property
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Featured properties appear on the homepage and get more visibility.
                        </p>
                    </div>
                </div>
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bedrooms*
                        </label>
                        <input
                            type="number"
                            id="bedrooms"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bedrooms ? 'border-red-500' : ''}`}
                            placeholder="e.g. 2"
                            min="0"
                        />
                        {errors.bedrooms && <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>}
                    </div>

                    <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bathrooms*
                        </label>
                        <input
                            type="number"
                            id="bathrooms"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bathrooms ? 'border-red-500' : ''}`}
                            placeholder="e.g. 2"
                            min="0"
                            step="0.5"
                        />
                        {errors.bathrooms && <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>}
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Area (sqft)*
                        </label>
                        <input
                            type="number"
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.area ? 'border-red-500' : ''}`}
                            placeholder="e.g. 1200"
                            min="0"
                        />
                        {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description*
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        className={`input dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.description ? 'border-red-500' : ''}`}
                        placeholder="Provide a detailed description of the property..."
                    ></textarea>
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Select amenities available in this property:
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {availableAmenities?.map(amenity => (
                            <div key={amenity} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity}`}
                                    checked={formData.amenities.includes(amenity)}
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

                <div className="mt-4">
                    <label htmlFor="custom-amenity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Add Custom Amenity
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="custom-amenity"
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-r-none"
                            placeholder="e.g. Home Theater"
                        />
                        <button
                            type="button"
                            onClick={handleAddCustomAmenity}
                            className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {formData.amenities.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Selected Amenities:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {formData.amenities.map(amenity => (
                                <span
                                    key={amenity}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                >
                                    {amenity}
                                    <button
                                        type="button"
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className="ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Property Images</h2>

                <div className="mb-4">
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary-light transition-colors"
                    >
                        <AddPhotoAlternateIcon className="mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Add Image</span>
                    </button>
                    {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                </div>

                {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove image"
                                >
                                    <DeleteIcon fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
                <Link to="/admin/properties">
                    <button
                        type="button"
                        // onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </Link>
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                    Update Property
                </button>
            </div>
        </form>
    );
};

export default PropertyEditForm;