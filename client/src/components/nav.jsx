import { Link } from 'react-router-dom';
import { useState } from 'react';
import "./style.css"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars ,faSearch,faUser,faShoppingBag} from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/Signin');
  };

  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between p-4">
      {/* Brand Name */}
      <h1 className="text-lg  brandname">Flex Fitness</h1>

      {/* Hamburger Menu Icon */}
      <button
        className="lg:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl" />
      </button>

      {/* Main Navigation */}
      <ul
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } lg:flex ml-24 flex-col lg:flex-row items-start lg:items-center font-bold gap-4 lg:gap-6 absolute lg:static top-14 left-0 w-1/3 h-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0 z-50 `}
      >
        <li className="menu_link ">
          <Link to="/Home" className="hover:text-gray-300">Home</Link>
        </li>
        <li className="relative group">
          <button className="hover:text-gray-300">Categories</button>
          <div className="absolute hidden group-hover:flex  flex-col z-50 bg-white text-black rounded shadow-lg mt-0 p-2 w-48">
            <Link to="/category/strength-training" className="px-4 py-2 hover:bg-gray-200">
              Strength Training Equipment
            </Link>
            <Link to="/category/cardio" className="px-4 py-2 hover:bg-gray-200">
              Cardio Equipment
            </Link>
            <Link to="/category/accessories" className="px-4 py-2 hover:bg-gray-200">
              Accessories
            </Link>
            <Link to="/category/yoga" className="px-4 py-2 hover:bg-gray-200">
              Yoga and Flexibility Tools
            </Link>
            <Link to="/category/apparel" className="px-4 py-2 hover:bg-gray-200">
              Gym Apparel and Footwear
            </Link>
            <Link to="/category/nutrition" className="px-4 py-2 hover:bg-gray-200">
              Nutrition and Hydration
            </Link>
          </div>
        </li>
        <li className="menu_link">
          <Link to="/" className="hover:text-gray-300">Contact Us</Link>
        </li>
      </ul>

      

      {/* Profile and Cart (Always Visible) */}
      <div className="flex items-center gap-4">
      <div className="max-md:h-9 lg:flex items-center gap-2 bg-transparent border-2 rounded-lg px-2 py-1">
        <input
          type="text" 
          placeholder="Search..."
          className="max-md:w-6  bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1"
        />
        <button
          
          className="text-white px-3 py-1 bg-transparent rounded-lg hover:bg-white hover:text-black"
        >
          <FontAwesomeIcon icon={faSearch} className="text-" />
        </button>
      </div>
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 hover:text-gray-300"
            onClick={() => setProfileOpen(!profileOpen)}
          >
          <FontAwesomeIcon icon={faUser} className="text-" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg z-50 p-2 w-32">
              <Link to="/Signup" className="block px-4 py-2 hover:bg-gray-200">
                Signup
              </Link>
              <Link to="/Signin" className="block px-4 py-2 hover:bg-gray-200">
                Signin
              </Link>
              
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/Cart">
        <FontAwesomeIcon icon={faShoppingBag} className="text-" />
        </Link>
      </div>
    </nav>
  );
}
