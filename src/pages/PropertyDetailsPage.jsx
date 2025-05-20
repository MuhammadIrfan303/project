import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path to your Firebase config
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// MUI Icons
// Remove these imports
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from 'react-hot-toast';

// Add this import at the top
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Add this before the component definition
// Fix Leaflet default icon issue


// Update the map section in your component
const PropertyDetailsPage = () => {
  const { id } = useParams(); // Get the `id` from the URL
  const [property, setProperty] = useState(null); // State to store the property data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [map, setMap] = useState(null); // State to hold the map instance
  const [isFavorite, setIsFavorite] = useState(false);
  const hasRecordedView = useRef(false);
  const { currentUser } = useAuth();
  const [advisor, setAdvisor] = useState(null);
  console.log(advisor);

  // Fetch property data from Firebase
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "Properties", id); // Reference to the document
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() }); // Set property data
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // if (!hasRecordedView.current) {
    //   recordPageView(id);
    //   hasRecordedView.current = true; // Mark as recorded
    // }
    fetchProperty();
  }, [id]);


  // Check if the property is favorited by the current user
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (currentUser) {
        const favoritesQuery = query(
          collection(db, "favorites"),
          where("userId", "==", currentUser.uid),
          where("propertyId", "==", id)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        setIsFavorite(!querySnapshot.empty);
      }
    };

    checkIfFavorite();
  }, [currentUser, id]);
  //Handle adding/removing from favorites
  // const toggleFavorite = async () => {
  //   if (!currentUser) {
  //     toast.error("Please log in to save properties to your favorites.");
  //     return;
  //   }

  //   try {
  //     const favoriteRef = doc(db, "favorites", `${currentUser.uid}_${id}`);

  //     if (isFavorite) {
  //       // Remove from favorites
  //       await deleteDoc(favoriteRef);
  //       setIsFavorite(false);
  //       toast.success("Property removed from favorites");
  //     } else {
  //       // Add to favorites
  //       await setDoc(favoriteRef, {
  //         userId: currentUser.uid,
  //         propertyId: id,
  //         createdAt: new Date(),
  //       });
  //       setIsFavorite(true);
  //       toast.success("Property added to favorites");
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //     toast.error("Something went wrong. Please try again.");
  //   }
  // };
  console.log(property?.advisorId)
  // here we get the property advisor details
  useEffect(() => {
    const fetchPropertyAdvisor = async () => {
      if (!property?.advisorId) return;

      try {
        const advisorRef = query(
          collection(db, 'Users'),
          where('uid', '==', property.advisorId)
        );
        const advisorSnap = await getDocs(advisorRef);

        if (!advisorSnap.empty) {
          const advisorData = advisorSnap.docs[0].data();
          setAdvisor({ id: advisorSnap.docs[0].id, ...advisorData });
        } else {
          console.log('Advisor not found');
        }
      } catch (error) {
        console.error('Error fetching advisor:', error);
      }
    };

    fetchPropertyAdvisor();
  }, [property?.advisorId]);

  //Handle adding/removing from favorites
  const toggleFavorite = async () => {
    if (!currentUser) {
      toast.error("Please log in to save properties to your favorites.");
      return;
    }

    try {
      const favoriteRef = doc(db, "favorites", `${currentUser.uid}_${id}`);

      if (isFavorite) {
        // Remove from favorites
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
        toast.success("Property removed from favorites");
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          userId: currentUser.uid,
          propertyId: id,
          createdAt: new Date(),
        });
        setIsFavorite(true);
        toast.success("Property added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // here we get the property advisor details

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container-custom mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where property is not found
  if (!property) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container-custom mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/properties" className="btn-primary py-2 px-6">
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Component to update the map view when the center changes
  const SetView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo(center, 15, { duration: 2 }); // Smooth transition to the new center
      }
    }, [center, map]);
    return null;
  };

  // Function to handle zoom in
  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1); // Increase zoom level by 1
    }
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1); // Decrease zoom level by 1
    }
  };

  // Format price based on property status
  const formatPrice = (price) => {
    return property.status === "for-rent"
      ? `${price.toLocaleString()}PKR/mo`
      : `${price.toLocaleString()}PKR`;
  };

  // Handle image navigation
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  // Handle share options
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background-light dark:bg-gray-900">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="container-custom mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/properties" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                    Properties
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500 dark:text-gray-300 truncate max-w-xs">
                    {property.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Property Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <LocationOnIcon className="mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={toggleFavorite}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isFavorite ? (
                <FavoriteIcon className="text-red-500" />
              ) : (
                <FavoriteBorderIcon className="text-gray-600 dark:text-gray-300" />
              )}
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ShareIcon className="text-gray-600 dark:text-gray-300" />
                <span>Share</span>
              </button>

              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Twitter
                  </a>
                  <a
                    href={`mailto:?subject=${property.title}&body=Check out this property: ${window.location.href}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Email
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                      setShowShareOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Images and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Property Images */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-96">
              <img
                src={property.images[activeImageIndex]}
                alt={`${property.title} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                aria-label="Previous image"
              >
                <ArrowBackIcon />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                aria-label="Next image"
              >
                <ArrowForwardIcon />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-black bg-opacity-50 text-white text-sm">
                {activeImageIndex + 1} / {property.images.length}
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${property.status === "for-rent"
                    ? "bg-secondary text-white"
                    : "bg-primary text-white"
                    }`}
                >
                  {property.status === "for-rent" ? "For Rent" : "For Sale"}
                </span>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`cursor-pointer rounded-md overflow-hidden h-20 ${activeImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Details Card */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Price */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-primary dark:text-primary-light">
                  {formatPrice(property.price)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {property.status === "for-rent" ? "Rental Price" : "Asking Price"}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <BedIcon className="mx-auto text-primary dark:text-primary-light mb-1" />
                  <p className="font-semibold">{property.bedrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <BathtubIcon className="mx-auto text-primary dark:text-primary-light mb-1" />
                  <p className="font-semibold">{property.bathrooms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <SquareFootIcon className="mx-auto text-primary dark:text-primary-light mb-1" />
                  <p className="font-semibold">{property.area}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</p>
                </div>
              </div>

              {/* Advisor Quick Contact */}
              {advisor && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <PersonIcon className="text-primary" />
                    <div>
                      <p className="font-semibold">{advisor.displayName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{advisor.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                    <PhoneIcon className="text-primary text-sm" />
                    <span className="text-sm">{advisor.phone}</span>
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="space-y-3">
                {advisor ? (
                  <>
                    <a
                      href={`tel:${advisor.phone}`}
                      className="btn-primary w-full py-3 flex items-center justify-center"
                    >
                      <PhoneIcon className="mr-2" />
                      Call Advisor
                    </a>
                    <a
                      href={`https://wa.me/${advisor.phone.replace(/\D/g, '')}?text=Hi, I'm interested in the property: ${property.title} (${window.location.href})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full py-3 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      </svg>
                      WhatsApp
                    </a>
                  </>
                ) : (
                  <a
                    href={`https://wa.me/+923478409915?text=Hi, I'm interested in the property: ${property.title} (${window.location.href})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full py-3 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    Contact via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property Description and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Property ID</span>
                    <span className="font-medium">{property.id}</span>
                  </div> */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Property Type</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Property Status</span>
                    <span className="font-medium capitalize">{property.status.replace("-", " ")}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Area</span>
                    <span className="font-medium">{property.area} sq ft</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="text-green-500 mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4 overflow-hidden relative">
                {property.latitude && property.longitude ? (
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    whenCreated={setMap}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[property.latitude, property.longitude]}
                      icon={new L.Icon.Default()}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold">{property.title}</h3>
                          <p className="text-sm">{property.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                    <SetView center={[property.latitude, property.longitude]} />
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Location data not available</p>
                  </div>
                )}

                {/* Zoom controls */}
                <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
                  <button
                    onClick={handleZoomIn}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Zoom In"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Zoom Out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 flex items-start">
                <LocationOnIcon className="text-primary dark:text-primary-light mr-2 mt-1 flex-shrink-0" />
                <span>{property.address}</span>
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <HomeIcon className="text-primary dark:text-primary-light mr-2" />
                  <span>Property ID: {property.id}</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <CalendarTodayIcon className="text-primary dark:text-primary-light mr-2" />
                  <span>Listed on: {new Date(property.createdAt.toDate()).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
