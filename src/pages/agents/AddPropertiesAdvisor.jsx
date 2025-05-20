import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const AddPropertiesAdvisor = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        type: 'house',
        status: 'for-sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        location: '',
        address: '',
        latitude: '',
        longitude: '',
        amenities: [],
        featured: false,
        images: []
    });
    const [amenityInput, setAmenityInput] = useState('');
    const [errors, setErrors] = useState({});

    const availableAmenities = [
        'Swimming Pool', 'Gym', 'Parking', 'Elevator', 'Security',
        'Balcony', 'Garden', 'Fireplace', 'Air Conditioning', 'Furnished'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

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

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleAddImage = async (e) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const loadingToast = toast.loading('Uploading images...');

        try {
            for (let i = 0; i < files.length; i++) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', files[i]);

                const response = await fetch("https://thebiol.com/wp-json/react-uploader/v1/upload", {
                    method: "POST",
                    body: formDataUpload,
                });

                if (!response.ok) throw new Error('Upload failed');

                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
            }
            toast.dismiss(loadingToast);
            toast.success('Images uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.dismiss(loadingToast);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
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
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        if (formData.latitude === '') newErrors.latitude = 'Latitude is required';
        if (formData.longitude === '') newErrors.longitude = 'Longitude is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, 'Properties'), {
                ...formData,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
                advisorId: currentUser.uid,
                advisorName: currentUser.displayName,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            toast.success('Property added successfully');
            navigate('/advisor/Dashbord');
        } catch (error) {
            console.error('Error adding property:', error);
            toast.error('Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold dark:text-white">Add New Property</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Toaster />
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Property Title*
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.title ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price (PKR)*
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.price ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type*
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="commercial">Commercial</option>
                                <option value="land">Land</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status*
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="for-sale">For Sale</option>
                                <option value="for-rent">For Rent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.city ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Address*
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.address ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Latitude*
                            </label>
                            <input
                                type="number"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.latitude ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Longitude*
                            </label>
                            <input
                                type="number"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.longitude ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Featured Property
                            </label>
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Property Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bedrooms*
                            </label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bedrooms ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.bedrooms && <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bathrooms*
                            </label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bathrooms ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.bathrooms && <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Area (sq ft)*
                            </label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.area ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description*
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.description ? 'border-red-500' : ''}`}
                            required
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>
                </div>

                {/* Amenities */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Amenities</h2>

                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Select amenities available in this property:
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {availableAmenities.map(amenity => (
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Add Custom Amenity
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                className="w-full p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g. Home Theater"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomAmenity}
                                className="px-4 py-2 bg-primary text-white rounded-r hover:bg-primary-dark"
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
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Property Images</h2>

                    <div className="mb-4">
                        <label
                            className={`flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary-light transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleAddImage}
                                disabled={uploading}
                                className="hidden"
                            />
                            <AddPhotoAlternateIcon className="mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                                {uploading ? 'Uploading...' : 'Upload Images'}
                            </span>
                        </label>
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
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                        {loading ? 'Adding Property...' : 'Add Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertiesAdvisor;