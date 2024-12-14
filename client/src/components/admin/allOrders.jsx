import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = 'http://localhost:4000';

const AllUsersOrdersPage = () => {
  const [orders, setOrders] = useState([]); // Store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const token = localStorage.getItem("authToken"); // Admin token

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/viewAllOrders`, {
          headers: { Authorization: `bearer ${token}` },
        });
        console.log('Fetched orders:', response.data); // Log the response for debugging

        if (Array.isArray(response.data.data)) {
          setOrders(response.data.data); // Only set orders if they are an array
          console.log('Orders state set:', response.data.data); // Log the orders state after setting
        } else {
          console.log('No orders found in the response');
          setOrders([]); // Set to empty array if the response is not an array
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders.");
        console.log('Error while fetching orders:', err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  console.log('Current orders state:', orders);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin: View All Users Orders</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 mb-6 shadow-md">
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600">Customer Name: {order.userId?.name}</p>
            <p className="text-gray-600">Customer Email: {order.userId?.email}</p>
            <p className="text-gray-600">Customer Phone: {order.userId?.phone}</p>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Delivery Address: {order.address}</p>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Products:</h3>
              {order.products.map((product, index) => (
                <div key={index} className="flex items-center border p-3 my-2 rounded">
                  <img
                    src={`${baseUrl}/${product.productId.product_images[0]}`}
                    alt={product.productId.title}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <div>
                    <p className="text-md font-semibold">{product.productId.title}</p>
                    <p className="text-gray-500">₹ {product.productId.price} x {product.quantity}</p>
                    <p className="text-gray-600">Total: ₹ {product.productId.price * product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AllUsersOrdersPage;
