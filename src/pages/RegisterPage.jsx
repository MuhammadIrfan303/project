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
            await register(formData.email, formData.password, formData);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h1 className="text-4xl font-bold text-white text-center mb-6">Create Account</h1>
                {error && <div className="bg-red-500/20 text-white p-4 rounded-xl mb-6">{error}</div>}
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