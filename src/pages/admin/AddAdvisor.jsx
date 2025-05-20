import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-hot-toast';

const AddAdvisor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        company: '',
        phone: '',
        licenseNumber: '',
        experience: '',
        about: '',
        city: '',
        area: '',
        address: '',
        role: 'advisor', // Changed from 'agent' to 'advisor'
        status: 'active'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create authentication account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Add to Users collection with email as document ID
            await setDoc(doc(db, 'Users', formData.email), {
                ...formData,
                uid: userCredential.user.uid,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                displayName: `${formData.firstName} ${formData.lastName}`,

            });

            toast.success('Property Advisor account created successfully');
            navigate('/admin/advisiors'); // Updated navigation path

        } catch (error) {
            console.error('Error creating advisor:', error);
            toast.error('Failed to create advisor account');
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        navigate('/admin/advisiors');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Property Advisor</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">License Number</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Years of Experience</label>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Area</label>
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-2">About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg h-32"
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-primary-dark transition"
                    >
                        {loading ? 'Creating Advisor...' : 'Create Advisor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAdvisor;