import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductCategoryPage() {
    const navigate=useNavigate();
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const response = await axios.get(`http://localhost:4000/products/category/${category}`);
        setProducts(response.data.data); // Set the fetched products in state
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      }
    }
    fetchCategoryProducts();
  }, [category]); // Refetch products when category changes

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Products in <span className="capitalize">{category.replace("-", " ")}</span>
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={`http://localhost:4000/${product.image}`}
                alt={product.title}
                className="h-48 w-full object-cover "
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                
                <h4 className="text-md font-thin text-gray-600 mb-2 line-clamp-1">{product.description}</h4>
                
                <p className="text-gray-800 font-bold mb-2">₹ {product.price}</p>
                <button className="bg-gray-900 text-white w-full px-4 py-2 rounded hover:bg-gray-700" onClick={()=>navigate(`/product/${product._id}`)} >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found in this category.</p>
      )}
    </div>
  );
}
