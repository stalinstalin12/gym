import './style.css';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import SellerNav from './sellerNav';
import { addToCart } from './cartUtil';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addToWishlist, removeFromWishlist } from './wishlistUtil'; // Import wishlist utils
import Carousel2 from './carousel2';

export default function SellerHome() {
  const productSectionRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [stockFilter, setStockFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  console.log(products, cartItems);

  const baseUrl = 'http://localhost:4000';
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  // Fetch products and wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/products`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        const allProducts = response.data.data;
        const productsNotAddedByUser = allProducts.filter(
          (product) => product.userId._id !== userId
        );

        setProducts(allProducts);
        setFilteredProducts(productsNotAddedByUser);
        setCategories([...new Set(allProducts.map((product) => product.category))]); // Get unique categories
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

    fetchProducts();
    fetchWishlist();
  }, [token, userId]);

  const isInWishlist = (productId) => wishlistItems.includes(productId);

  // Filter products based on search query, category, price, and stock
  const filterProducts = () => {
    return filteredProducts.filter((product) => {
      const matchesSearchQuery =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock =
        stockFilter === '' ||
        (stockFilter === 'inStock' && product.stock > 0) ||
        (stockFilter === 'outOfStock' && product.stock === 0);

      return matchesSearchQuery && matchesCategory && matchesPrice && matchesStock;
    });
  };

  // If there is a search query, filter from the filteredProducts list
  const productsToDisplay = filterProducts();

  // Scroll handler
  const handleScrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SellerNav onSearch={setSearchQuery} />
      <div className="container-fluid w-full bg-white">
        <ToastContainer />
        <div className="relative container">
          <Carousel2 />
          <div className="absolute bottom-0 left-1/3 right-1/3 text-center py-4">
            <button
              onClick={handleScrollToProducts}
              className="bg-black text-white font-bold py-2 px-4 rounded"
            >
              Explore Products
            </button>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md mx-auto mt-2 container">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">Special Offer!</p>
              <p>
                Join now and get <span className="font-bold">50% off</span> on your first order.
              </p>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold text-sm">
              Use Code: <span className="font-bold">FLEX100 - <br /> To avail an instant discount of Rs 100</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="container mx-auto my-8 p-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Filters</h3>
          <div className="flex flex-wrap gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-gray-700">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full p-2 border rounded"
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
              <label className="block text-gray-700">Price Range</label>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, e.target.value])}
                className="block w-full"
              />
              <p>₹ 0 - ₹ {priceRange[1]}</p>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-gray-700">Stock</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="block w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div ref={productSectionRef} className="container mx-auto my-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h3>
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsToDisplay.map((product) => (
              <div key={product._id} className="bg-white drop-shadow-xl rounded-lg overflow-hidden">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[1]}`
                      : './public/images/default-image.png'
                  }
                  alt={product.title}
                  className="w-full h-40 object-contain hover:cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold capitalize line-clamp-1">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                  {product.stock === 0 || product.stock == null ? (
                    <p className="text-red-600 font-semibold">Out Of Stock</p>
                  ) : (
                    <p className="text-green-600 font-semibold">In Stock</p>
                  )}

                  <div className="flex justify-between mt-3">
                    {/* Add to Cart Button */}
                    <button
                        onClick={() => {
                          if (product.stock > 0) {
                            addToCart(product._id, token, setCartItems);
                          }
                        }}
                        className={`p-2 h-9 w-9 rounded-full ${
                          product.stock > 0
                            ? cartItems.includes(product._id)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-black hover:bg-gray-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={product.stock === 0 || product.stock == null}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="text-white text-lg" />
                      </button>

                    {/* Wishlist Button */}
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
