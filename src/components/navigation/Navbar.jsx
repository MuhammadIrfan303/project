import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaHome,
  FaBuilding,
  FaUserTie,
  FaNewspaper,
  FaAngleDown,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-white ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Top Bar */}
      <div className="bg-[#1B4168] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm hidden sm:block">All Pakistan Real Estate Directory</div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Property ID..."
                  className="py-1 px-3 pr-8 text-sm rounded bg-white text-gray-800 w-40 md:w-48 focus:outline-none focus:ring-1 focus:ring-[#1B4168]"
                />
                <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="text-white hover:text-gray-200 text-sm flex items-center">
                      <FaUserCircle className="mr-1" />
                      Admin
                    </Link>
                  )}
                  {currentUser?.role === 'advisor' && (
                    <Link to="/advisor/Dashbord" className="text-white hover:text-gray-200 text-sm flex items-center">
                      <FaUserTie className="mr-1" />
                      Advisor
                    </Link>
                  )}
                  {currentUser?.role === 'user' && (
                    <Link to="/profile" className="text-white hover:text-gray-200 text-sm flex items-center">
                      <FaUser className="mr-1" />
                      Profile
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 text-sm flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-gray-200 text-sm flex items-center">
                    <FaSignInAlt className="mr-1" />
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:text-gray-200 text-sm flex items-center">
                    <FaUserPlus className="mr-1" />
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaYoutube size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="PakRealEstate" className="h-10 md:h-12" />
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-[#1B4168] font-medium">
                <FaHome className="text-lg" />
                <span>Home</span>
              </Link>

              <div className="relative group">
                <button
                  className="flex items-center gap-2 text-gray-700 hover:text-[#1B4168] font-medium"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <FaBuilding className="text-lg" />
                  <span>Properties</span>
                  <FaAngleDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link to="/properties?type=house" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4168]">Houses</Link>
                  <Link to="/properties?type=apartment" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4168]">Apartments</Link>
                  <Link to="/properties?type=commercial" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4168]">Commercial</Link>
                  <Link to="/properties?type=plot" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4168]">Plots</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link to="/properties" className="block px-4 py-2 text-[#1B4168] font-medium hover:bg-gray-50">
                    View All →
                  </Link>
                </div>
              </div>

              <Link to="/advisor" className="flex items-center gap-2 text-gray-700 hover:text-[#1B4168] font-medium">
                <FaUserTie className="text-lg" />
                <span>Find Advisor</span>
              </Link>

              <Link to="/blogs" className="flex items-center gap-2 text-gray-700 hover:text-[#1B4168] font-medium">
                <FaNewspaper className="text-lg" />
                <span>Blog</span>
              </Link>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {currentUser ? (
                <>
                  {currentUser?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserCircle />
                      Admin Dashboard
                    </Link>
                  )}
                  {currentUser?.role === 'advisor' && (
                    <Link 
                      to="/advisor/Dashbord" 
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserTie />
                      Advisor Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md text-left"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaSignInAlt />
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserPlus />
                    Register
                  </Link>
                </>
              )}

              <div className="border-t border-gray-200 my-1"></div>

              <Link 
                to="/" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome />
                Home
              </Link>

              <div className="flex flex-col">
                <button
                  className="flex items-center justify-between gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    <FaBuilding />
                    <span>Properties</span>
                  </div>
                  <FaAngleDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="pl-10 py-1 space-y-2">
                    <Link 
                      to="/properties?type=house" 
                      className="block px-3 py-2 text-gray-700 hover:text-[#1B4168]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Houses
                    </Link>
                    <Link 
                      to="/properties?type=apartment" 
                      className="block px-3 py-2 text-gray-700 hover:text-[#1B4168]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Apartments
                    </Link>
                    <Link 
                      to="/properties?type=commercial" 
                      className="block px-3 py-2 text-gray-700 hover:text-[#1B4168]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Commercial
                    </Link>
                    <Link 
                      to="/properties?type=plot" 
                      className="block px-3 py-2 text-gray-700 hover:text-[#1B4168]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Plots
                    </Link>
                    <Link 
                      to="/properties" 
                      className="block px-3 py-2 text-[#1B4168] font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All →
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to="/advisor" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserTie />
                Find Advisor
              </Link>

              <Link 
                to="/blogs" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1B4168] hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaNewspaper />
                Blog
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;