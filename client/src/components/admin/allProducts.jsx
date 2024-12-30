import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNav from "./adminNav";
import AdminBlockedProductsPage from "./blockedproducts";
const baseUrl = 'http://localhost:4000';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]); // Store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [reason, setReason] = useState(""); // Reason for blocking
  const [blockProductId, setBlockProductId] = useState(null); // The product ID being blocked
  const [isBlocking, setIsBlocking] = useState(false); // State to track if blocking is in progress

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`, {
          headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` },
        });
        console.log('Fetched products:', response.data); // Log the response for debugging

        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data); // Only set products if they are an array
          console.log('Products state set:', response.data.data); // Log the products state after setting
        } else {
          console.log('No products found in the response');
          setProducts([]); // Set to empty array if the response is not an array
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load products.");
        console.log('Error while fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBlockProduct = async () => {
    if (!reason) {
      setError("Please provide a reason to block the product.");
      return;
    }

    try {
      setIsBlocking(true);
      await axios.put(`${baseUrl}/blockProduct/${blockProductId}`, { reason }, {
        headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` },
      });
      setProducts(prevProducts => prevProducts.filter(product => product._id !== blockProductId));
      setIsBlocking(false);
      setReason(""); // Reset reason input
      setBlockProductId(null); // Reset the selected product ID
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to block product.");
      setIsBlocking(false);
    }
  };

  console.log('Current products state:', products);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container-fluid mx-auto">
      <AdminNav />
      <h1 className="text-2xl font-bold mb-6 p-6">All Products</h1>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <Link title="Click to view product details" to={`/product/${product._id}`}>
                <img
                  src={`${baseUrl}/${product.product_images[0]}`}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h2 className="text-lg font-semibold line-clamp-1">{product.title}</h2>
                <p className="text-gray-600 line-clamp-1">{product.description}</p>
                <p className="text-gray-800 font-bold">₹ {product.price}</p>
                <p className="text-gray-500 capitalize">Sold by: {product.userId?.name}</p> {/* Display the seller's name */}
                <p className="text-gray-500">Uploaded on: {new Date(product.createdAt).toLocaleDateString()}</p>
              </Link>

              <button
                onClick={() => {
                  setBlockProductId(product._id); // Set product ID to be blocked
                }}
                className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
              >
                Block
              </button>

              {/* Show reason input and block confirmation only if this product is selected for blocking */}
              {blockProductId === product._id && (
                <div className="mt-4">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for blocking"
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleBlockProduct}
                    disabled={isBlocking}
                    className={`mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 ${isBlocking ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isBlocking ? 'Blocking...' : 'Confirm Block'}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <AdminBlockedProductsPage />
    </div>
  );
};

export default AllProductsPage;
