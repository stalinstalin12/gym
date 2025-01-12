import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SubNav from "../subNav";

const baseUrl = "http://localhost:4000"; // Adjust this base URL to match your API.

export default function UserProducts() {
  const { id } = useParams(); // Extract seller/user ID from route params
  const [userProducts, setUserProducts] = useState([]); // Store user products
  const [ownerName, setOwnerName] = useState(""); // Store owner's name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [blockProductId, setBlockProductId] = useState(null); // Product ID to block
  const [reason, setReason] = useState(""); // Reason for blocking
  const [isBlocking, setIsBlocking] = useState(false); // Block action state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate = useNavigate(); // For navigation

  // Fetch user-specific products and owner's name
  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get(`${baseUrl}/products/seller/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // Authorization
        });
        setUserProducts(productResponse.data.data || []); // Set products or empty array if none

        // Fetch owner's name
        const userResponse = await axios.get(`${baseUrl}/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }, // Authorization
        });
        const user = userResponse.data.data[0];
        setOwnerName(user?.name || "Unknown User"); // Set owner's name or fallback to "Unknown User"
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products.");
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [id]);

  // Block product handler
  const handleBlockProduct = async () => {
    if (!reason) {
      setError("Please provide a reason to block the product.");
      return;
    }

    try {
      setIsBlocking(true);
      await axios.put(
        `${baseUrl}/blockProduct/${blockProductId}`,
        { reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setUserProducts((prevProducts) => prevProducts.filter((product) => product._id !== blockProductId));
      setSuccessMessage("Product successfully blocked.");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      setReason("");
      setBlockProductId(null);
      setIsBlocking(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to block product.");
      setIsBlocking(false);
    }
  };

  return (
    <div className="container-fluid w-full">
      <SubNav /> {/* Sub-navigation component */}
      <div className="container mx-auto my-8 px-4">
        {/* Display Owner's Name */}
        <h3 className="text-2xl text-center font-bold capitalize text-gray-800 mb-4">
          {loading ? "Loading..." : `${ownerName}'s Products`}
        </h3>

        {/* Loading State */}
        {loading && <p>Loading products...</p>}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(userProducts) && userProducts.length > 0 ? (
            userProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                {/* Product Image */}
                <img
                  src={
                    product.product_images?.length > 0
                      ? `${baseUrl}/${product.product_images[0]}` // Use the first image
                      : "/images/default-image.png" // Fallback to a default image
                  }
                  alt={product.title || "Product"}
                  className="w-full h-40 object-cover hover:cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)} // Navigate to product details on click
                />

                {/* Product Info */}
                <div className="p-4">
                  <h4 className="text-lg font-bold capitalize line-clamp-1">{product.title}</h4>
                  <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                  <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">
                    {product.description}
                  </h4>
                  <p className="text-gray-500 mt-2 capitalize">{product.category}</p>

                  {/* Block Button */}
                  <button
                    onClick={() => setBlockProductId(product._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded mt-2 hover:bg-red-800"
                  >
                    Block
                  </button>
                </div>
              </div>
            ))
          ) : (
            // No Products Found
            <p className="text-gray-500">No products found for {ownerName}.</p>
          )}
        </div>

        {/* Block Reason Popup */}
        <AnimatePresence>
          {blockProductId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Block Product</h3>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for blocking"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setBlockProductId(null)}
                    className="bg-gray-400 text-white py-1 px-3 rounded mr-2 hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlockProduct}
                    disabled={isBlocking}
                    className={`bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 ${
                      isBlocking ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isBlocking ? "Blocking..." : "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Message Popup */}
          {successMessage && (
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Error Message Popup */}
          {error && (
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
