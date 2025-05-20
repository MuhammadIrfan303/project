import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch } from 'react-icons/fa';


const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        'all',
        'Market Trends',
        'Investment Tips',
        'Property Guide',
        'Legal Advice',
        'Home Improvement',
        'Area Guides'
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                let blogsQuery = collection(db, 'blogs');
                if (selectedCategory !== 'all') {
                    blogsQuery = query(blogsQuery, where('category', '==', selectedCategory));
                }
                const snapshot = await getDocs(blogsQuery);
                const blogsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogs(blogsData);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [selectedCategory]);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50  pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="bg-[#1B4168] rounded-2xl p-8 mb-12 text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">PakProperty Blog</h1>
                    <p className="text-lg opacity-90 mb-8">Stay informed about the latest real estate trends and insights</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-full transition-all ${selectedCategory === category
                                ? 'bg-[#1B4168] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map(blog => (
                            <Link
                                key={blog.id}
                                to={`/blog/${blog.id}`}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                {blog.images && blog.images[0] && (
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={blog.images[0]}
                                            alt={blog.title}
                                            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#1B4168] text-white px-3 py-1 rounded-full text-sm">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.summary}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {new Date(blog.createdAt?.toDate()).toLocaleDateString()}
                                        </span>
                                        <span className="text-[#1B4168] font-medium group-hover:translate-x-2 transition-transform">
                                            Read More →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredBlogs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-600 text-lg">No blogs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;