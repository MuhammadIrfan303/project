import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaHome } from 'react-icons/fa';

const AdvisorProfile = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const agentDoc = await getDoc(doc(db, 'Users', id));
                if (agentDoc.exists()) {
                    setAgent({ id: agentDoc.id, ...agentDoc.data() });

                    // Fetch properties
                    const propertiesQuery = query(
                        collection(db, 'Properties'),
                        where('advisorId', '==', agentDoc.id)
                    );
                    const propertiesSnapshot = await getDocs(propertiesQuery);
                    setProperties(propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (!agent) return (
        <div className="flex justify-center items-center min-h-screen">
            <div>
                <h2>Agent Not Found</h2>
                <Link to="/agents">Back to Agents</Link>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="h-32 w-32 rounded-full bg-[#1B4168] flex items-center justify-center text-4xl text-white">
                        {agent.firstName?.[0]}{agent.lastName?.[0]}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold">{agent.firstName} {agent.lastName}</h1>
                        <p className="text-gray-600">{agent.company}</p>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <FaBriefcase className="text-blue-500" />
                                <span>{agent.experience} years experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span>{agent.city}, {agent.area}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <a href={`tel:${agent.phone}`} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <FaPhone /> Call
                        </a>
                        <a href={`https://wa.me/${agent.phone}`} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <FaWhatsapp /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaPhone className="text-blue-500" />
                            <span>{agent.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-blue-500" />
                            <span>{agent.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span>{agent.address || `${agent.city}, ${agent.area}`}</span>
                        </div>
                    </div>

                    {agent.about && (
                        <div className="mt-6 pt-4 border-t">
                            <h2 className="text-xl font-semibold mb-2">About</h2>
                            <p className="text-gray-600">{agent.about}</p>
                        </div>
                    )}
                </div>

                {/* Properties Summary */}
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Properties</h2>
                    <div className="bg-[#1B4168] text-white rounded-lg p-6 text-center">
                        <p className="text-4xl font-bold">{properties.length}</p>
                        <p>Total Properties Listed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorProfile;