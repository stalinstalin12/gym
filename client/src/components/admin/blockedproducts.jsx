import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = 'http://localhost:4000';

const AdminBlockedProductsPage = () => {
  const [blockedProducts, setBlockedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blocked products when the component mounts
  useEffect(() => {
    const fetchBlockedProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/blockedproducts`, {
          headers: {
            Authorization: `bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setBlockedProducts(response.data.data);
        } else {
          setBlockedProducts([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load blocked products.");
        setLoading(false);
      }
    };

    fetchBlockedProducts();
  }, []);

  const handleUnblockProduct = async (productId) => {
    try {
      await axios.put(`${baseUrl}/unblockProduct/${productId}`, {}, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update the UI after unblocking the product by filtering it out of the list
      setBlockedProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId)
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to unblock product.");
    }
  };

  if (loading) return <p>Loading blocked products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container-fluid mx-auto">
      <h1 className="text-2xl font-bold mb-6 p-6">Blocked Products</h1>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {blockedProducts.length > 0 ? (
          blockedProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <img
                src={`${baseUrl}/${product.product_images[0]}`}
                alt={product.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600 line-clamp-1">{product.description}</p>
              <p className="text-gray-800 font-bold">₹ {product.price}</p>
              <p className="text-gray-500 capitalize">Sold by: {product.userId?.name}</p>
              <p className="text-gray-500">Blocked Reason: {product.blockedReason || "No reason provided"}</p>
              <p className="text-red-600 font-bold">Status: Blocked</p>

              {/* Unblock button */}
              <button
                onClick={() => handleUnblockProduct(product._id)}
                className="mt-4 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800"
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <p>No blocked products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBlockedProductsPage;
