import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const projects = [
    {
      title: "PC TOWER",
      subtitle: "1ST SMART OFFICE BUILDING",
      progress: "70% CONSTRUCTION COMPLETED",
      location: "Plot No. (47-48) B Main Jinnah Avenue Bahria Town Karachi",
      phone: "0304-111-1316",
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      background: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg"
    },
    {
      title: "BUSINESS BAY",
      subtitle: "PREMIUM OFFICE SPACES",
      progress: "BOOKING OPEN",
      location: "Main Boulevard, Gulberg III, Lahore",
      phone: "0304-222-2427",
      image: "https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg",
      background: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
    },
    {
      title: "SKY GARDENS",
      subtitle: "LUXURY APARTMENTS",
      progress: "READY FOR POSSESSION",
      location: "F-10 Markaz, Islamabad",
      phone: "0304-333-3538",
      image: "https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg",
      background: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, projects.length]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentImageIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentImageIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${projects[currentImageIndex].background})`,
            backgroundColor: '#0a192f' // Navy blue background
          }}
        />
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 z-20 text-white hover:text-amber-400 transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={40} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 z-20 text-white hover:text-amber-400 transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight size={40} />
      </button>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Project Image */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <img
                src={projects[currentImageIndex].image}
                alt={projects[currentImageIndex].title}
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-amber-400/20 hover:border-amber-400/40"
              />
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Content */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6 text-amber-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {projects[currentImageIndex].title}
              </motion.h2>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {projects[currentImageIndex].subtitle}
              </motion.h1>
              <motion.div
                className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-lg inline-block mb-6 transform hover:scale-105 transition-transform shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {projects[currentImageIndex].progress}
              </motion.div>

              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-amber-400" size={20} />
                  <p className="text-gray-400">{projects[currentImageIndex].location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-amber-400" size={20} />
                  <p className="text-2xl font-bold text-gray-400">{projects[currentImageIndex].phone}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/contact"
                  className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-lg inline-block transition-all transform hover:scale-105 hover:shadow-xl border-2 border-amber-400/30 hover:border-amber-400/50"
                >
                  FOR PRICES CLICK HERE
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlay(false);
              setCurrentImageIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
              ? 'bg-amber-400 w-6 shadow-md shadow-amber-400/50'
              : 'bg-gray-300 bg-opacity-50 hover:bg-opacity-75'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;