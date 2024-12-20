import './style.css';
import Nav from './nav';
import axios from 'axios';
import { useState, useEffect,useRef } from 'react';
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
  const productSectionRef = useRef(null); // Reference for the product section
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const baseUrl = 'http://localhost:4000';
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch products
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

        setProducts(sortedProducts);
        setNewArrivals(recentProducts);
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
  }, [token]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())||product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isInWishlist = (productId) => wishlistItems.includes(productId);

  

  // Scroll handler
  const handleScrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Nav  onSearch={setSearchQuery}/>
      <div className="container-fluid w-full bg-white">
        <ToastContainer />
        <div className=" relative container">
          <Carousel2 />
          <div className="absolute bottom-0 left-1/3 right-1/3 text-center py-4">
        <button
          onClick={handleScrollToProducts}
          className="bg-black  text-white font-bold py-2 px-4 rounded-2xl"
        >
          Explore Products
        </button>
      </div>
        </div>
        
        
        
    <Carousel />
        {/* New Arrivals Section */}
        <div className="container mx-auto my-8 p-4">
  <h3 className="text-2xl font-bold text-gray-800 mb-4">New Arrivals</h3>
  {loading && <p>Loading new arrivals...</p>}
  {error && <p className="text-red-500">{error}</p>}
  <div className="flex gap-6 overflow-x-auto scrollbar-hide ">
    {newArrivals.map((product) => (
      <div key={product._id} className="bg-white  min-w-[200px] w-[300px] shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
          <h4 className="text-md  text-gray-600 mt-2 line-clamp-1">{product.description}</h4>
           <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
          <div className="text-black flex flex-col gap-3 mt-2">
            {product.stock === 0 || product.stock == null ? (
              <p className="text-red-600 font-semibold">Out Of Stock</p>
            ) : (
              <p className="text-green-600 font-semibold">In Stock</p>
            )}
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product._id, token, setCartItems);
                  }
                }}
                className="p-2 bg-black hover:bg-gray-600 rounded-full w-9 h-9"
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
  </div>
</div>


        {/* Special Offer Section */}
        <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md mx-auto mt-8 container">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">Special Offer!</p>
              <p>
                Join now and get <span className="font-bold">50% off</span> on your first order.
              </p>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold text-sm">
              Use Code: <span className="font-bold">FLEX100</span> - <br />
              To avail an instant discount of Rs 100
            </div>
          </div>
        </div>

        {/* All Products Section */}
        <div ref={productSectionRef} className="container mx-auto my-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h3>
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white min-w-[200px] w-[300px] shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                <h4 className="text-md  text-gray-600 mt-2 line-clamp-1">{product.description}</h4>
                 <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                <div className="text-black flex flex-col gap-3 mt-2">
                  {product.stock === 0 || product.stock == null ? (
                    <p className="text-red-600 font-semibold">Out Of Stock</p>
                  ) : (
                    <p className="text-green-600 font-semibold">In Stock</p>
                  )}
                  <div className="flex justify-between mt-2">
                  <button
                      onClick={() => {
                        if (product.stock > 0 ) {
                          addToCart(product._id, token, setCartItems);
                          console.log(cartItems);
                          
                        }
                      }}
                      className={`p-2 h-9 w-9 rounded-full ${
                        product.stock > 0 
                          ? 'bg-black hover:bg-gray-700 active:bg-red-800'
                          : 'bg-gray-400 cursor-not-allowed'
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
            <p className="col-span-full text-gray-500">No products found</p>
          )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
