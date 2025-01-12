import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NoData from "./noDataFound"; // Import the NoData component
import SubNav from "./subNav";

export default function ProductCategoryPage() {
  const navigate = useNavigate();
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const baseUrl = "http://localhost:4000";

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const response = await axios.get(
          `http://localhost:4000/products/category/${category}`
        );
        setProducts(response.data.data); // Set the fetched products in state
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      }
    }
    fetchCategoryProducts();
  }, [category]); // Refetch products when category changes

  if (error) {
    console.log(error)
  }

  return (
  <div className="main"><SubNav />
    <div className="px-9 py-4 bg-white container-fluid">
      
      <h1 className="text-2xl font-bold mb-6 text-center">
        <span className="capitalize">{category.replace("-", " ")}</span>
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={
                  product.product_images && product.product_images.length > 0
                    ? `${baseUrl}/${product.product_images[1]}`
                    : "./public/images/default-image.png" // Fallback to a default image
                }
                alt={product.title}
                className="w-full h-40 object-contain hover:cursor-pointer"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-1">
                  {product.title}
                </h3>
                <h4 className="text-md font-thin text-gray-600 mb-2 line-clamp-1">
                  {product.description}
                </h4>
                <p className="text-gray-800 font-bold mb-2">₹ {product.price}</p>
                <button
                  className="bg-gray-900 text-white w-full px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoData
          message="No products found in this category"
          subMessage="Try browsing other categories or come back later!"
        />
      )}
    </div>
    </div>
  );
}
