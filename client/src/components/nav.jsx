import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faSearch,
  faUser,
  faShoppingBag,
  faHeart,
  faSignOutAlt,
  faListAlt,
  faUserPlus,
  faSignInAlt,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

export default function Nav({ onSearch }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categories = [
    { name: 'Strength Training Equipment', path: '/category/strength training equipment' },
    { name: 'Cardio Equipment', path: '/category/cardio' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Yoga and Flexibility Tools', path: '/category/yoga and flexibility' },
    { name: 'Nutrition and Hydration', path: '/category/nutrition and hydration' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
    setSearchQuery('');
    setMenuOpen(false); // Close menu after search on mobile
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_type');
    navigate('/Signin');
  };

  const getHomePath = () => {
    const usertype = localStorage.getItem('user_type');
    return usertype === '6738b70b20495c12314f4c4f' ? '/sellerHome' : '/home';
  };

  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <nav className="bg-gray-900 text-white p-4 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className=" brandname">Flex Fitness</h1>

        {/* Hamburger Menu Icon */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="text-2xl" />
        </button>

        {/* Desktop Navigation */}
        <ul className=" hidden lg:flex items-center gap-6 font-bold">
          <li className='menu_link'>
            <Link to={getHomePath()} className=" transition">
              Home
            </Link>
          </li>
          <li className="relative group className='menu_link'">
            <button className=" transition">Categories</button>
            <div className="absolute hidden group-hover:flex flex-col z-50 bg-white text-black rounded shadow-lg mt-2 p-2 w-48">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="px-4 py-2 hover:bg-gray-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </li>
          <li className='menu_link'>
            <Link to="/contact" className=" transition">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center bg-transparent border rounded-lg">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 px-2 py-1 outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 hover:bg-white hover:text-black rounded-lg transition"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-800 transition"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Profile Menu"
            >
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-50 w-48">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      to="/myOrders"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faListAlt} className="text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/Signup"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="text-gray-500" />
                      <span>Signup</span>
                    </Link>
                    <Link
                      to="/Signin"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="text-gray-500" />
                      <span>Signin</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart and Wishlist */}
          <Link to="/Cart">
            <FontAwesomeIcon icon={faShoppingBag} className="text-xl hover:text-green-500" />
          </Link>
          <Link to="/wishlist">
            <FontAwesomeIcon icon={faHeart} className="text-xl hover:text-red-600" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center z-50">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-800 rounded-lg p-2 w-4/5 mt-4"
          >
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 px-2 py-1 outline-none w-full"
            />
            <button type="submit" className="text-white px-2 hover:text-black">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
          <ul className="text-white text-center space-y-6 mt-6">
            <li>
              <Link
                to={getHomePath()}
                className="text-2xl hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <button
                className="text-2xl flex items-center gap-2 hover:text-gray-400"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories <FontAwesomeIcon icon={faChevronDown} />
              </button>
              {categoriesOpen && (
                <div className="flex flex-col mt-4 space-y-4 text-lg">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="hover:text-gray-400"
                      onClick={() => setMenuOpen(false)}
                    >
                      {category.name}
                      </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link
                to="/contact"
                className="text-2xl hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

Nav.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

