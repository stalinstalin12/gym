


import { Link } from 'react-router-dom';
import { useState } from 'react';
import "../style.css"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars ,faSearch,faUser} from '@fortawesome/free-solid-svg-icons';

export default function AdminNav() {
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
        } lg:flex max:mt-3 flex-col lg:flex-row items-start lg:items-center font-bold gap-4 lg:gap-6 absolute lg:static top-14 left-0 w-1/3 h-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0 z-50 `}
      >
        <li className="menu_link ">
          <Link to="/adminHome" className="">Dashboard</Link>
        </li>
        
        <li className="menu_link">
        <Link to="/AllProducts" className="">Products</Link>
        </li>
        <li className="menu_link">
          <Link to="/viewUsers" className="">Users</Link>
        </li>
        <li className="menu_link">
          <Link to="/AllOrders" className="">Purchases</Link>
        </li>
      </ul>

      

      {/* Profile and search */}
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
            className="flex items-center gap-2 "
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
      </div>
    </nav>
  );
}
