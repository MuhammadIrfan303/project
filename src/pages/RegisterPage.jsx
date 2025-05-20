import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, currentUser } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) navigate('/');
        document.title = 'Register | RealEstate Hub';
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);

            // Password validation
            if (formData.password.length < 6) {
                throw { code: 'auth/weak-password' };
            }

            await register(formData.email, formData.password, formData);
            navigate('/Login');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters long.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your internet connection.');
                    break;
                default:
                    setError('Failed to create an account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h1 className="text-4xl font-bold text-white text-center mb-6">Create Account</h1>
                {error && (
                    <div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-xl mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
                    </div>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
                    <button type="submit" disabled={loading} className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="text-white/80 text-center mt-6">
                    Already have an account? <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;