import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../../firebase';
import { Dialog } from '@headlessui/react';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        images: [],
        summary: ''
    });

    const categories = [
        'Market Trends',
        'Investment Tips',
        'Property Guide',
        'Legal Advice',
        'Home Improvement',
        'Area Guides',
        'Real Estate Guide'
    ];

    // Fetch blogs from Firestore
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'blogs'));
                const blogsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBlogs(blogsData);
            } catch (error) {
                toast.error('Failed to fetch blogs');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleImageChange = async (e) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const loadingToast = toast.loading('Uploading images...');

        try {
            for (let i = 0; i < files.length; i++) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', files[i]);

                const response = await fetch("https://thebiol.com/wp-json/react-uploader/v1/upload", {
                    method: "POST",
                    body: formDataUpload,
                });

                if (!response.ok) throw new Error('Upload failed');

                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
            }
            toast.dismiss(loadingToast);
            toast.success('Images uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.dismiss(loadingToast);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'blogs'), {
                ...formData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            toast.success('Blog post created successfully');
            setShowForm(false);
            setFormData({
                title: '',
                content: '',
                category: '',
                images: [],
                summary: ''
            });

            // Refresh the blog list
            const querySnapshot = await getDocs(collection(db, 'blogs'));
            const blogsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBlogs(blogsData);
        } catch (error) {
            toast.error('Failed to create blog post');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Add new state for delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, blogId: null });

    // Update handleDelete function
    const handleDelete = async () => {
        if (!deleteConfirm.blogId) return;
        
        try {
            await deleteDoc(doc(db, 'blogs', deleteConfirm.blogId));
            toast.success('Blog post deleted successfully');
            setBlogs(blogs.filter(blog => blog.id !== deleteConfirm.blogId));
        } catch (error) {
            toast.error('Failed to delete blog post');
            console.error(error);
        } finally {
            setDeleteConfirm({ show: false, blogId: null });
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Blog Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FaPlus /> Add New Blog
                </button>
            </div>

            {/* Dialog Form */}
            <Dialog open={showForm} onClose={() => setShowForm(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <Dialog.Title className="text-xl font-semibold mb-4">Create New Blog Post</Dialog.Title>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-2">Summary</label>
                                        <input
                                            type="text"
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-2">Content</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full p-2 border rounded-lg h-32"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Featured Images</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="w-full p-2 border rounded-lg"
                                            disabled={uploading}
                                        />
                                        {formData.images.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                {formData.images.map((url, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={url}
                                                            alt={`Upload ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    images: prev.images.filter((_, i) => i !== index)
                                                                }));
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-primary/90"
                                    >
                                        {loading ? 'Creating...' : 'Create Blog Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Table view */}
            {loading && !showForm ? (
                <div className="text-center py-8">Loading blogs...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Summary</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {blogs.map(blog => (
                                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {blog.images && blog.images.length > 0 && (
                                                <img
                                                    src={blog.images[0]}
                                                    alt={blog.title}
                                                    className="h-16 w-24 object-cover rounded-lg"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{blog.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {blog.summary}
                                            </div>
                                        </td>
                                        {/* Add Delete Confirmation Dialog */}
                                        <Dialog open={deleteConfirm.show} onClose={() => setDeleteConfirm({ show: false, blogId: null })} className="relative z-50">
                                            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                                            
                                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                                <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                                    <div className="p-6">
                                                        <Dialog.Title className="text-xl font-semibold text-gray-900">Delete Blog Post</Dialog.Title>
                                                        <div className="mt-3">
                                                            <p className="text-gray-600">
                                                                Are you sure you want to delete this blog post? This action cannot be undone.
                                                            </p>
                                                        </div>
                                                        <div className="mt-6 flex justify-end gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteConfirm({ show: false, blogId: null })}
                                                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleDelete}
                                                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Dialog.Panel>
                                            </div>
                                        </Dialog>
                                        {/* Update delete button in table */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setDeleteConfirm({ show: true, blogId: blog.id })}
                                                className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Blog"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;