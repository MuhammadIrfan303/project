import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) navigate(location.state?.from?.pathname || '/');
    document.title = 'Login | RealEstate Hub';
  }, [currentUser, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Welcome Back</h1>
        {error && <div className="bg-red-500/20 text-white p-4 rounded-xl mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-white/80 text-center mt-6">
          Don't have an account? <Link to="/register" className="text-white font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;