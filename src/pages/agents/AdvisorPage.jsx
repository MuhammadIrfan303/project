import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaRegStar, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AdvisorPage = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        area: '',  // Add area filter
        experience: '',
        specialization: ''
    });

    // Get unique cities and areas from agents data
    const uniqueCities = [...new Set(agents.map(agent => agent.city))].filter(Boolean).sort();
    const uniqueAreas = [...new Set(agents.map(agent => agent.area))].filter(Boolean).sort();

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const q = query(
                    collection(db, 'Users'),
                    where('role', '==', 'advisor'),
                    where('status', '==', 'active')
                );
                const querySnapshot = await getDocs(q);
                const agentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    rating: doc.data().ratings || 0,
                    reviews: doc.data().reviews?.length || 0
                }));
                setAgents(agentsData);
            } catch (error) {
                console.error('Error fetching agents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !filters.city || agent.city === filters.city;
        const matchesArea = !filters.area || agent.area === filters.area;
        const matchesExp = !filters.experience || parseInt(agent.experience) >= parseInt(filters.experience);

        return matchesSearch && matchesCity && matchesArea && matchesExp;
    });



    const [adminContact, setAdminContact] = useState({
        phone: '',
        whatsapp: '',
    });

    useEffect(() => {
        const fetchAdminContact = async () => {
            try {
                const adminDoc = await getDocs(query(collection(db, 'Users'), where('role', '==', 'admin')));
                if (!adminDoc.empty) {
                    const adminData = adminDoc.docs[0].data();
                    setAdminContact({
                        phone: adminData.phone || '',
                        whatsapp: adminData.whatsapp || adminData.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching admin contact:', error);
            }
        };

        fetchAdminContact();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-7 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Property Advisor</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Connect with professional property advisors who can help you find or sell your property
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or company..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full sm:w-auto">
                            <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <select
                                id="city-filter"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={filters.city}
                                onChange={(e) => {
                                    setFilters({ ...filters, city: e.target.value, area: '' });
                                }}
                            >
                                <option value="">Select City</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {filters.city && (
                            <div className="w-full sm:w-auto">
                                <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                                <select
                                    id="area-filter"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={filters.area}
                                    onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                                >
                                    <option value="">Select Area</option>
                                    {agents
                                        .filter(agent => agent.city === filters.city)
                                        .map(agent => agent.area)
                                        .filter((area, index, self) => area && self.indexOf(area) === index)
                                        .sort()
                                        .map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        <div className="w-full sm:w-auto">
                            <label htmlFor="experience-filter" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                            <select
                                id="experience-filter"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={filters.experience}
                                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                            >
                                <option value="">Any Experience</option>
                                <option value="1">1+ Years</option>
                                <option value="3">3+ Years</option>
                                <option value="5">5+ Years</option>
                                <option value="10">10+ Years</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Agent Cards Section */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {filteredAgents.length} {filteredAgents.length === 1 ? 'Property Advisor' : 'Property Advisors'} Found
                            </h2>
                            <div className="text-sm text-gray-500">
                                Sorted by: <span className="font-medium">Highest Rating</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAgents.map((agent) => (
                                <div key={agent.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-semibold text-white">
                                                {agent.firstName?.[0]}{agent.lastName?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-bold text-lg text-gray-900">
                                                    {agent.firstName} {agent.lastName}
                                                </h2>
                                                <p className="text-primary font-medium">{agent.company}</p>

                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                                <span>{agent.city}{agent.area && `, ${agent.area}`}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <FaBriefcase className="mr-2 text-gray-400" />
                                                <span>{agent.experience} years experience</span>
                                            </div>
                                            {agent.specialization && (
                                                <div className="flex items-center text-gray-600">
                                                    <FaUserTie className="mr-2 text-gray-400" />
                                                    <span>Specializes in {agent.specialization}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <Link
                                                to={`/advisor/${agent.id}`}
                                                className="text-primary hover:text-primary-dark font-medium transition-colors"
                                            >
                                                View Full Profile →
                                            </Link>
                                            <div className="flex gap-3">
                                                <a
                                                    href={`https://wa.me/${agent.phone}`}
                                                    className="text-green-600 hover:text-green-700 transition-colors"
                                                    aria-label="WhatsApp"
                                                >
                                                    <FaWhatsapp size={20} />
                                                </a>
                                                <a
                                                    href={`tel:${agent.phone}`}
                                                    className="text-blue-600 hover:text-blue-700 transition-colors"
                                                    aria-label="Call"
                                                >
                                                    <FaPhone size={20} />
                                                </a>
                                                <a
                                                    href={`mailto:${agent.email}`}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                    aria-label="Email"
                                                >
                                                    <FaEnvelope size={20} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* No Results State */}
                {!loading && filteredAgents.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No property advisors found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({ city: '', experience: '', specialization: '' });
                            }}
                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl overflow-hidden">
                        <div className="p-8 md:p-10 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Become a Property Advisor</h2>
                            <p className="text-lg mb-6 max-w-2xl mx-auto">
                                Join our network of professional property advisors and grow your business with us
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {adminContact.whatsapp && (
                                    <a
                                        href={`https://wa.me/${adminContact.whatsapp}`}
                                        className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        <FaWhatsapp size={20} />
                                        Contact on WhatsApp
                                    </a>
                                )}
                                {adminContact.phone && (
                                    <a
                                        href={`tel:${adminContact.phone}`}
                                        className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        <FaPhone size={20} />
                                        Call Now
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorPage;