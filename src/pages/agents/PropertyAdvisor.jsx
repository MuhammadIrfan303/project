import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaHome, FaMoneyBillWave, FaChartLine, FaUsers } from 'react-icons/fa';

const PropertyAdvisor = () => {
    const { currentUser } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchProperties();
    }, [currentUser]);

    const fetchProperties = async () => {
        try {
            const q = query(
                collection(db, 'Properties'),
                where('advisorId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const propertiesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(propertiesData);
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteDoc(doc(db, 'Properties', propertyId));
                toast.success('Property deleted successfully');
                fetchProperties();
            } catch (error) {
                console.error('Error deleting property:', error);
                toast.error('Failed to delete property');
            }
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.price.toString().includes(searchTerm) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProperties = [...filteredProperties].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === 'ascending') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Add new statistics calculations
    const statsData = {
        totalProperties: properties.length,
        saleProperties: properties.filter(p => p.status === 'for-sale').length,
        rentalProperties: properties.filter(p => p.status === 'for-rent').length,

    };

    return (
        <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FaHome className="text-blue-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Properties</p>
                            <h3 className="text-xl font-bold text-gray-700">{statsData.totalProperties}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FaMoneyBillWave className="text-green-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">For Sale</p>
                            <h3 className="text-xl font-bold text-gray-700">{statsData.saleProperties}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <FaChartLine className="text-purple-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">For Rent</p>
                            <h3 className="text-xl font-bold text-gray-700">{statsData.rentalProperties}</h3>
                        </div>
                    </div>
                </div>


            </div>

            {/* Existing header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Properties</h1>
                <Link
                    to="/advisor/add-property"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
                >
                    <FaPlus /> Add New Property
                </Link>
            </div>

            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full p-2 pl-10 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary"></div>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No properties found. Add your first property!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('title')}>
                                    Property
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('price')}>
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}>
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('city')}>
                                    Location
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedProperties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={property.images[0] || 'default-property-image.jpg'}
                                                alt={property.title}
                                                className="h-10 w-10 rounded-full object-cover mr-3"
                                            />
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        PKR {property.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'for-sale'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {property.city}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/propertyEdit/${property.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProperty(property.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PropertyAdvisor;