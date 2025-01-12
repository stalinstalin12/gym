import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  // faSearch,
  faShoppingBag,
  faHeart,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function SubNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (onSearch) {
  //     onSearch(searchQuery.trim()); // Pass search query to parent
  //   }
  // };

  // Determine home path based on user type
  const getHomePath = () => {
    const usertype = localStorage.getItem('user_type');
    if (usertype === '6738b70b20495c12314f4c4f') {
      return '/sellerHome'; // Seller home
    } else if (usertype === '674ddd8ada8e8225185e33b6') {
      return '/adminHome'; // Admin home
    } else {
      return '/home'; // Default home
    }  };

  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between p-4">
      <div className='flex gap-5'>
      <button
          className="text-white px-3 py-1 bg-transparent rounded-lg hover:bg-white hover:text-black"
          onClick={() => window.history.back()}
          disabled={window.history.length <= 1} // Disable if there's no previous page
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      {/* Brand Name */}
      <Link to={getHomePath()}>
      <h1 className="text-lg font-mono brandname">Flex Fitness</h1>
      </Link>
      </div>
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
        } lg:flex max:mt-3 flex-col lg:flex-row items-start lg:items-center font-bold gap-4 lg:gap-6 absolute lg:static top-14 left-0 w-1/3 h-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0 z-50`}
      >
        
        <li className="menu_link">
          <Link to={getHomePath()} className="">Home</Link>
        </li>
        <li className="menu_link">
          <Link to="/contact" className="">Contact Us</Link>
        </li>
        
      </ul>

      {/* Profile, Cart, and Navigation Buttons */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {/* <div className="max-md:h-9 lg:flex items-center gap-2 bg-transparent border-2 rounded-lg px-2 py-1">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-md:w-6 bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1"
            />
            <button
              type="submit"
              className="text-white px-3 py-1 bg-transparent rounded-lg hover:bg-white hover:text-black"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div> */}

       
        
        

        {/* Cart Icon */}
        <Link to="/Cart">
          <FontAwesomeIcon icon={faShoppingBag} className="text-xl" />
        </Link>

        {/* Wishlist Icon */}
        <Link to="/wishlist">
          <FontAwesomeIcon icon={faHeart} className="text-xl text-white" />
        </Link>
        <button
          className="text-white px-3 py-1 bg-transparent rounded-lg hover:bg-white hover:text-black"
          onClick={() => window.history.forward()}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </nav>
  );
}

SubNav.propTypes = {
  onSearch: PropTypes.func.isRequired, // Make onSearch a required function
};
