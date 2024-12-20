import './style.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Footer from './footer';
import SellerNav from './sellerNav';

export default function YourUploads() {
  const [unblockedProducts, setUnblockedProducts] = useState([]);
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = 'http://localhost:4000'; 
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  // Fetch unblocked products
  useEffect(() => {
    const fetchUnblockedProducts = async () => {
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
        const userOwnedProducts = allProducts.filter((product) => product.userId._id === userId);

        setUnblockedProducts(userOwnedProducts);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      }
    };

    const fetchBlockedProducts = async () => {
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/blockedproducts`, {
          headers: {
            Authorization: `bearer ${token}`, 
          },
        });
        const allProducts = response.data.data;
        const userOwnedProducts = allProducts.filter((product) => product.userId._id === userId);

        setBlockedProducts(userOwnedProducts);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      }
    };

    fetchUnblockedProducts();
    fetchBlockedProducts();
    setLoading(false);
  }, [token, userId]);

  return (
    <>
      <SellerNav />
      <ToastContainer />
      <div className="container-fluid w-full">
        <div className="container mx-auto my-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h3>
          {/* Loading State */}
          {loading && <p>Loading products...</p>}
          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(unblockedProducts) && unblockedProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[0]}`
                      : './public/images/default-image.png' // Fallback to a default image
                  }
                  alt={product.title}
                  className={`w-full h-40 object-contain hover:cursor-pointer`}
                  onClick={() => navigate(`/product/${product._id}`)}
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold capitalize">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                </div>
              </div>
            ))}
            {Array.isArray(blockedProducts) && blockedProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[0]}`
                      : './public/images/default-image.png' // Fallback to a default image
                  }
                  alt={product.title}
                  className={`w-full h-40 object-contain hover:cursor-pointer filter blur-sm`}
                />
                <span className="absolute top-1 left-7 w-1/3 text-center bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded">
                  Blocked
                </span>
                <div className="p-4">
                  <h4 className="text-lg font-bold capitalize">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
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
