import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaCalendar, FaTag, FaArrowLeft, FaShare } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const fetchBlogAndRelated = async () => {
            try {
                // Fetch main blog
                const docRef = doc(db, 'blogs', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const blogData = { id: docSnap.id, ...docSnap.data() };
                    setBlog(blogData);

                    // Fetch related posts
                    const relatedQuery = query(
                        collection(db, 'blogs'),
                        where('category', '==', blogData.category),
                        where('__name__', '!=', id),
                        limit(3)
                    );
                    const relatedSnap = await getDocs(relatedQuery);
                    setRelatedPosts(relatedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogAndRelated();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-xl text-gray-600">Blog post not found.</p>
                <Link to="/blog" className="text-primary hover:underline">Return to Blog List</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <Toaster />
            <div className="max-w-4xl mx-auto">
                <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                    <FaArrowLeft className="mr-2" /> Back to Blogs
                </Link>

                <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {blog.images && blog.images[0] && (
                        <div className="relative h-[400px]">
                            <img
                                src={blog.images[0]}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="flex items-center">
                                        <FaCalendar className="mr-2" />
                                        {new Date(blog.createdAt?.toDate()).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <FaTag className="mr-2" />
                                        {blog.category}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold">{blog.title}</h1>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="prose max-w-none">
                            {blog.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-gray-700 leading-relaxed mb-6">{paragraph}</p>
                            ))}
                        </div>

                        {blog.images && blog.images.length > 1 && (
                            <div className="mt-12">
                                <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {blog.images.slice(1).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-primary hover:text-primary-dark"
                            >
                                <FaShare /> Share this article
                            </button>
                        </div>
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map(post => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.id}`}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                                >
                                    {post.images && post.images[0] && (
                                        <img
                                            src={post.images[0]}
                                            alt={post.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{post.summary}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPost;