import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const baseUrl = "http://localhost:4000"; // Adjust this base URL to match your API.

export default function UserProducts() {
  const { id } = useParams();
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products/seller/${id}`);
        setUserProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [id]);

  return (
    <div className="container-fluid w-full">
      <div className="container mx-auto my-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h3>

        {/* Loading State */}
        {loading && <p>Loading products...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(userProducts) &&
            userProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? `${baseUrl}/${product.product_images[0]}` // Use the first image
                      : './public/images/default-image.png' // Fallback to a default image
                  }
                  alt={product.title}
                  className="w-full h-40 object-cover hover:cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}
