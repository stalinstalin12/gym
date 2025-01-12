import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSearch,
  faUser,
  faShoppingBag,
  faHeart,
  faSignOutAlt,
  faListAlt,
  faUserPlus,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function Nav({ onSearch }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <nav className="bg-gray-900 text-white flex items-center justify-between p-4">
      {/* Brand Name */}
      <h1 className="text-lg font-mono brandname">Flex Fitness</h1>

      {/* Hamburger Menu Icon */}
      <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={faBars} className="text-2xl" />
      </button>

      {/* Main Navigation */}
      <ul
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } lg:flex max:mt-3 flex-col lg:flex-row items-start lg:items-center font-bold gap-4 lg:gap-6 absolute lg:static top-14 left-0 w-1/3 h-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0 z-50`}
      >
        <li className="menu_link">
          <Link to={getHomePath()} className="">
            Home
          </Link>
        </li>
        <li className="relative group">
          <button className="">Categories</button>
          <div className="absolute hidden group-hover:flex flex-col z-50 bg-white text-black rounded shadow-lg mt-0 p-2 w-48">
            {categories.map((category) => (
              <Link key={category.name} to={category.path} className="px-4 py-2 hover:bg-gray-200">
                {category.name}
              </Link>
            ))}
          </div>
        </li>
        <li className="menu_link">
          <Link to="/contact" className="">
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Profile and Cart (Always Visible) */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="max-md:h-9 lg:flex items-center gap-2 bg-transparent border-2 rounded-lg px-2 py-1">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-md:w-6 bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1"
            />
            <button className="text-white px-3 py-1 bg-transparent rounded-lg hover:bg-white hover:text-black">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-800 transition-all duration-200"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <FontAwesomeIcon icon={faUser} className="text-xl text-white" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-50 w-48">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    <span>Your Profile</span>
                  </Link>
                  <Link
                    to="/myOrders"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faListAlt} className="text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Signup"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="text-gray-500" />
                    <span>Signup</span>
                  </Link>
                  <Link
                    to="/Signin"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="text-gray-500" />
                    <span>Signin</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/Cart">
          <FontAwesomeIcon icon={faShoppingBag} className="text-xl" />
        </Link>

        {/* Wishlist Icon */}
        <Link to="/wishlist">
          <FontAwesomeIcon icon={faHeart} className="text-xl text-white" />
        </Link>
      </div>
    </nav>
  );
}

Nav.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
