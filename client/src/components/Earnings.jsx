import { useEffect, useState } from "react";
import axios from "axios";
import SubNav from "./subNav";

const Earnings = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = "http://localhost:4000";
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${baseUrl}/seller/purchasedProducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.data;
        console.log(data);

        // Calculate total earnings
        const total = data.reduce((sum, order) => {
          const orderTotal = order.products.reduce(
            (orderSum, product) => {
              const price = product.price || 0;
              const quantity = product.quantity || 0;
              const productTotal = price * quantity;
              return orderSum + productTotal;
            },
            0
          );
          return sum + orderTotal;
        }, 0);

        setPurchasedProducts(data);
        setTotalEarnings(total);
      } catch (err) {
        console.error("Error fetching purchased products:", err);
        setError(err.response?.data?.message || "Failed to fetch purchased products.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
  <div>
  <SubNav />
    <div className="max-w-full  mx-auto p-8 bg-gray-50 min-h-screen">
        
      <h1 className="text-4xl font-mono font-semibold text-gray-900 text-center mb-8">
        Sold Products
      </h1>
      <h3 className="text-2xl font-medium text-green-600 text-center mb-8">
        Total Earnings: ${totalEarnings.toFixed(2)}
      </h3>

      {purchasedProducts.length === 0 ? (
        <p className="text-center text-gray-500">No purchased products found.</p>
      ) : (
        <div className="space-y-8">
          {purchasedProducts.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order ID: {order.orderId}</h3>
                <span className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="text-gray-700 mb-4">
                <p>
                  <span className="font-semibold">Buyer:</span> {order.buyer?.name} ({order.buyer?.email})
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {order.address}
                </p>
              </div>

              <h4 className="text-lg font-medium text-gray-900 mb-2">Products:</h4>
              <ul className="space-y-4">
                {order.products.map((product) => {
                  const price = product.price || 0;
                  const quantity = product.quantity || 0;
                  const totalPrice = price * quantity;

                  return (
                    <li
                      key={product.productId}
                      className="flex justify-between items-center bg-gray-100 rounded-md p-4 border border-gray-300 hover:bg-gray-200 transition-all duration-200"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{product.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">${price} × {quantity}</span>
                        <span className="font-semibold text-green-600">= ${totalPrice}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Earnings;
