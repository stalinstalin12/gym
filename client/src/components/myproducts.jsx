import './style.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Footer from './footer';
import SubNav from './subNav';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import default styles
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion


export default function YourUploads() {
  const [unblockedProducts, setUnblockedProducts] = useState([]);
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([])
  const baseUrl = 'http://localhost:4000';
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  // Fetch products
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
        // Ensure userId exists before filtering
        const userOwnedProducts = allProducts.filter((product) => product.userId && product.userId._id === userId);

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
        // Ensure userId exists before filtering
        const userOwnedProducts = allProducts.filter((product) => product.userId && product.userId._id === userId);

        setBlockedProducts(userOwnedProducts);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      }
    };

    fetchUnblockedProducts();
    fetchBlockedProducts();
    setLoading(false);
  }, [token, userId]);

  const addNotification = (message, type) => {
    const id = Math.random().toString(36).substring(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000); // Auto-remove after 3 seconds
  };

  const handleDelete = async (productId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`${baseUrl}/product/${productId}`, {
                headers: {
                  Authorization: `bearer ${token}`,
                },
              });
              addNotification('Product deleted successfully', 'success');
              setUnblockedProducts((prev) => prev.filter((product) => product._id !== productId));
              setBlockedProducts((prev) => prev.filter((product) => product._id !== productId));
            } catch (err) {
              addNotification(err.response?.data?.message || "Failed to delete the product", 'error');
            }
          },
        },
        {
          label: 'No',
          onClick: () => addNotification('Product deletion cancelled', 'info'),
        },
      ],
    });
  };

  return (
    <>
      <SubNav />
       {/* Render notifications */}
       <div className="fixed top-5 right-5 space-y-4">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`p-4 rounded shadow-md ${
                type === 'success'
                  ? 'bg-green-500 text-white'
                  : type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="container-fluid w-full">
        <div className="container mx-auto my-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h3>
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(unblockedProducts) && unblockedProducts.map((product) => (
              <div key={product._id} className=" bg-white shadow-lg border-gray-400 rounded-lg overflow-hidden relative">
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
                  <h4 className="text-lg font-bold capitalize line-clamp-1">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                  <div className="flex justify-between">
                  {/* Edit Button */}
                  <button
                    className="mt-4 bg-red-600 text-white text-sm font-semibold py-1 px-4 rounded"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    <FontAwesomeIcon icon={faPencil} className="mr-2" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="mt-4 ml-2 bg-gray-800 text-white text-sm font-semibold py-1 px-4 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </button>
                  </div>
                </div>
              </div>
            ))}
            {Array.isArray(blockedProducts) && blockedProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[0]}`
                      : './public/images/default-image.png'
                  }
                  alt={product.title}
                  className="w-full h-40 object-contain hover:cursor-pointer filter blur-sm"
                />
                <span className="absolute top-1 left-7 w-1/3 text-center bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded">
                  Blocked
                </span>
                <div className="p-4">
                  <h4 className="text-lg font-bold capitalize line-clamp-1">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                  {/* Edit Button */}
                  <button
                    className="mt-4 bg-red-600 text-white text-sm font-semibold py-1 px-4 rounded"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    <FontAwesomeIcon icon={faPencil} className="mr-2" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="mt-4 ml-2 bg-gray-800 text-white text-sm font-semibold py-1 px-4 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </button>
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
