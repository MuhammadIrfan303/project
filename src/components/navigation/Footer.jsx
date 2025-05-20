import { Link } from 'react-router-dom';

// Icons
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { BsBuilding, BsHouseDoor, BsShop } from 'react-icons/bs';
import { MdApartment, MdVilla } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">PakProperty</h3>
            <p className="text-gray-400 mb-4">
              Pakistan's leading real estate marketplace connecting buyers and sellers across all major cities.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white text-xl">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white text-xl">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white text-xl">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-white text-xl">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>

              <li><Link to="/agents" className="text-gray-400 hover:text-white">Find Agents</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-xl font-bold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li><Link to="/properties/lahore" className="text-gray-400 hover:text-white">Lahore</Link></li>
              <li><Link to="/properties/karachi" className="text-gray-400 hover:text-white">Karachi</Link></li>
              <li><Link to="/properties/islamabad" className="text-gray-400 hover:text-white">Islamabad</Link></li>
              <li><Link to="/properties/faisalabad" className="text-gray-400 hover:text-white">Faisalabad</Link></li>
              <li><Link to="/properties/rawalpindi" className="text-gray-400 hover:text-white">Rawalpindi</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-primary" />
                <span className="text-gray-400">
                  Office 12, ABC Tower, Main Boulevard,<br />
                  Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-primary" />
                <a href="tel:+924211234567" className="text-gray-400 hover:text-white">+92 42 11234567</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary" />
                <a href="mailto:info@pakproperty.com" className="text-gray-400 hover:text-white">info@pakproperty.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} PakProperty. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Use</Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;