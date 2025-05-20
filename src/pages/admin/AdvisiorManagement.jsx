import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaEye, FaKey, FaUserPlus } from 'react-icons/fa';

const AdvisiorManagement = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const q = query(
                    collection(db, 'Users'),
                    where('role', '==', 'advisor')
                );
                const querySnapshot = await getDocs(q);
                const agentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
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

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const handlePasswordReset = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset link sent successfully');
        } catch (error) {
            toast.error('Error sending password reset link');
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Advisor Management</h1>
                    <p className="text-gray-600 mt-1">Manage all registered advisors</p>
                </div>
                <Link
                    to="/admin/add-advisior"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <FaUserPlus /> Add New Advisor
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                {agent.firstName?.[0]}{agent.lastName?.[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{agent.firstName} {agent.lastName}</div>
                                                <div className="text-sm text-gray-500">{agent.specialization || 'General'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{agent.email}</td>
                                    <td className="px-6 py-4">{agent.phone}</td>
                                    <td className="px-6 py-4">{agent.company}</td>
                                    <td className="px-6 py-4">{agent.city}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handlePasswordReset(agent.email)}
                                                className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors"
                                                title="Send Password Reset Link"
                                            >
                                                <FaKey size={16} />
                                            </button>
                                            <Link
                                                to={`/advisor/${agent.id}`}
                                                className="text-green-600 hover:text-green-800 bg-green-50 p-2 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdvisiorManagement;