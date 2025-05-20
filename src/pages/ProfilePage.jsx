import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import PropertyCard from './../components/properties/PropertyCard';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data and favorite properties
    useEffect(() => {
        const fetchUserAndFavorites = async () => {
            try {
                // Fetch the current user
                const user = auth.currentUser;
                if (!user) {
                    console.log("No user logged in.");
                    setIsLoading(false);
                    return;
                }
                // Fetch user details from Firestore
                const userDocRef = doc(db, 'Users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ id: userDocSnap.id, ...userDocSnap.data() });
                } else {
                    console.log("User document not found.");
                }

                // Fetch favorite properties
                const favoritesQuery = query(
                    collection(db, 'favorites'),
                    where('userId', '==', user.uid)
                );
                const favoritesSnapshot = await getDocs(favoritesQuery);

                // Fetch property details for each favorite
                const favoritePropertiesData = [];
                for (const favoriteDoc of favoritesSnapshot.docs) {
                    const propertyId = favoriteDoc.data().propertyId;
                    const propertyDocRef = doc(db, 'Properties', propertyId);
                    const propertyDocSnap = await getDoc(propertyDocRef);

                    if (propertyDocSnap.exists()) {
                        favoritePropertiesData.push({
                            id: propertyDocSnap.id,
                            ...propertyDocSnap.data(),
                        });
                    }
                }

                setFavoriteProperties(favoritePropertiesData);
            } catch (error) {
                console.error('Error fetching user or favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAndFavorites();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        <img
                            src={user?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
                        <p className="text-gray-500 dark:text-gray-500">
                            Member since{' '}
                            {user?.createdAt?.seconds
                                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                : new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Favorite Properties
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                        {favoriteProperties.length}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Last Active
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {user?.lastLogin
                            ? new Date(user.lastLogin.seconds * 1000).toLocaleDateString()
                            : 'Never'}
                    </p>
                </div>
            </div>

            {/* Favorite Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Favorite Properties
                </h2>
                {favoriteProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            You haven't added any properties to your favorites yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;