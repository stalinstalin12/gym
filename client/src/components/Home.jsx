import './style.css';
import Nav from './nav';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import { addToCart } from './cartUtil';
import { addToWishlist, removeFromWishlist } from './wishlistUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import Carousel from './carousel';
import Carousel2 from './carousel2';

export default function Home() {
  const productSectionRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [stockFilter, setStockFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const baseUrl = 'http://localhost:4000';
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        const allProducts = response.data.data;
        
        // Sort products by creation date (descending)
        const sortedProducts = allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Separate new arrivals (e.g., products added within the last 7 days)
        const twoDays = new Date();
        twoDays.setDate(twoDays.getDate() - 2);
        const recentProducts = sortedProducts.filter((product) => new Date(product.createdAt) >= twoDays);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(allProducts.map((product) => product.category))];

        setProducts(sortedProducts);
        setNewArrivals(recentProducts);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${baseUrl}/viewWishlist`, {
          headers: { Authorization: `bearer ${token}` },
        });
        setWishlistItems(response.data.items.map((item) => item.productId._id));
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    const fetchCart = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${baseUrl}/viewCart`, {
          headers: { Authorization: `bearer ${token}` },
        });
        setCartItems(response.data.items.map((item) => item.productId._id));
        // Update localStorage to sync with the backend cart
        localStorage.setItem('cartItems', JSON.stringify(response.data.items.map((item) => item.productId._id)));
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    // Get cart items from localStorage if available
    const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(localCartItems);
    
    fetchCart();
    fetchProducts();
    fetchWishlist();
  }, [token]);

  const isInCart = (productId) => cartItems.includes(productId);

  // Handle adding/removing from cart
  const handleAddToCart = (productId) => {
    if (!isInCart(productId)) {
      addToCart(productId, token, setCartItems); // Assuming this function adds the item to the cart
    }
  };

  // Filter products based on search query, category, price, and stock
  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesStock =
      stockFilter === '' ||
      (stockFilter === 'inStock' && product.stock > 0) ||
      (stockFilter === 'outOfStock' && product.stock === 0);

    return matchesSearchQuery && matchesCategory && matchesPrice && matchesStock;
  });

  const isInWishlist = (productId) => wishlistItems.includes(productId);

  const handleScrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Nav onSearch={setSearchQuery} />
      <div className="container-fluid w-full bg-white">
        <ToastContainer />
        <div className="relative container-fluid">
          <Carousel2 />
          <div className="absolute bottom-0 left-1/3 right-1/3 text-center py-4">
            <button
              onClick={handleScrollToProducts}
              className="bg-black text-white font-bold py-2 px-4 rounded-2xl"
            >
              Explore Products
            </button>
          </div>
        </div>

        <Carousel />

        {/* New Arrivals Section */}
        <div className="container mx-auto my-8 p-4">
          <h3 className="text-2xl font-bold text-center font-serif text-gray-800 mb-4">New Arrivals</h3>
          {loading && <p>Loading new arrivals...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {newArrivals.length === 0 ? (
            <div className="text-center font-mono font-bold text-xl text-gray-600">
              <p>No new arrivals at the moment.</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {newArrivals.map((product) => (
                <div
                  key={product._id}
                  className="bg-white min-w-[200px] w-[300px] shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[0]}`
                      : './public/images/default-image.png'
                    }
                    alt={product.title}
                    className="w-full h-40 object-contain hover:cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  <div className="p-4">
                    <h4 className="text-lg text-gray-900 font-bold capitalize line-clamp-1">{product.title}</h4>
                    <p className="text-gray-900 mt-2 font-semibold">₹ {product.price}</p>
                    <h4 className="text-md text-gray-600 mt-2 line-clamp-1">{product.description}</h4>
                    <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                    <div className="text-black flex flex-col gap-3 mt-2">
                      {product.stock === 0 || product.stock == null ? (
                        <p className="text-red-600 font-semibold">Out Of Stock</p>
                      ) : (
                        <p className="text-green-600 font-semibold">In Stock</p>
                      )}
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className={`p-2 h-9 w-9 rounded-full ${product.stock === 0 || product.stock == null ? 'bg-gray-400 cursor-not-allowed' : (isInCart(product._id) ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-700')}`}
                          disabled={product.stock === 0 || product.stock == null} // Disable button if out of stock
                        >
                          <FontAwesomeIcon icon={faCartPlus} className="text-white text-lg" />
                        </button>
                        <button
                          onClick={() =>
                            isInWishlist(product._id)
                              ? removeFromWishlist(product._id, token, setWishlistItems)
                              : addToWishlist(product._id, token, setWishlistItems)
                          }
                          className={`p-2 h-9 w-9 rounded-full ${isInWishlist(product._id) ? 'bg-red-600' : 'bg-gray-400'}`}
                        >
                          <FontAwesomeIcon icon={faHeart} className="text-white text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Filters Section */}
          <div className="container mx-auto my-8 px-4">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    {/* Filters Section */}
    <div className="bg-white border-r-2  p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Filters</h3>
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex items-center gap-4">
          {/* Start Price Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              value={priceRange[0]}
              min="0"
              max="100000"
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="₹ 0"
            />
          </div>

          {/* End Price Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max="100000"
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="₹ 100000"
            />
          </div>
        </div>

        {/* Display Range */}
        <p className="text-sm text-gray-500 mt-2">
          ₹ {priceRange[0]} - ₹ {priceRange[1]}
        </p>
      </div>


        {/* Stock Filter */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Stock</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    {/* Products Section */}
    <div ref={productSectionRef} className="lg:col-span-3" >
      <h3 className="text-2xl font-bold text-center font-serif text-gray-800 mb-8">Our Products</h3>
      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={
                product.product_images && product.product_images.length > 0
                  ? `${baseUrl}/${product.product_images[0]}`
                  : './public/images/default-image.png'
              }
              alt={product.title}
              className="w-full h-40 object-contain hover:cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            />
            <div className="p-4">
              <h4 className="text-lg text-gray-900 font-bold capitalize line-clamp-1">{product.title}</h4>
              <p className="text-gray-900 mt-2 font-semibold">₹ {product.price}</p>
              <h4 className="text-md text-gray-600 mt-2 line-clamp-1">{product.description}</h4>
              <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
              <div className="text-black flex flex-col gap-3 mt-2">
                {product.stock === 0 || product.stock == null ? (
                  <p className="text-red-600 font-semibold">Out Of Stock</p>
                ) : (
                  <p className="text-green-600 font-semibold">In Stock</p>
                )}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className={`p-2 h-9 w-9 rounded-full ${
                      product.stock === 0 || product.stock == null
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isInCart(product._id)
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-black hover:bg-gray-700'
                    }`}
                    disabled={product.stock === 0 || product.stock == null}
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="text-white text-lg" />
                  </button>
                  <button
                    onClick={() =>
                      isInWishlist(product._id)
                        ? removeFromWishlist(product._id, token, setWishlistItems)
                        : addToWishlist(product._id, token, setWishlistItems)
                    }
                    className={`p-2 rounded-full w-9 h-9 ${
                      isInWishlist(product._id) ? 'bg-red-600' : 'bg-black'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`text-lg ${isInWishlist(product._id) ? 'text-white' : 'text-white'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No products found</p>
        )}
      </div>
      </div>
    </div>
  </div>

        </div>
        <Footer />
      </>
    );
  }
