import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNav from "./subNav";

export default function Checkout() {
  const { state } = useLocation(); // Data passed from cart or single product
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const [total, setTotal] = useState(state?.total || 0);
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const user_id=localStorage.getItem("userId")

  useEffect(() => {
    // Fetch user details to get saved addresses
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/user/${user_id}`);
  
        // Extract the address from the response
        const userData = response.data.data[0];
        if (userData && userData.address) {
          setSavedAddresses([userData.address]); // Assuming a single address
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };
  
    fetchUserDetails();
  });
  

  const handlePlaceOrder = async () => {
    if (!address) {
      setError("Address is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        address,
        total,
        paymentMethod,
      };

      const response = await axios.post(
        "http://localhost:4000/createOrder",
        orderData,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setCartItems([]);
        setTotal(0);
        navigate("/ordersuccess", {
          state: {
            orderId: response.data.order._id,
            total: response.data.order.total,
            orderDate: response.data.order.createdAt,
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <SubNav />

      <div className="flex flex-col lg:flex-row lg:justify-between items-start min-h-screen bg-white p-4 lg:p-8">
        {/* Delivery Details */}
        <ToastContainer />
        <div className="bg-white w-full lg:w-1/2 rounded-lg p-6 mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Details</h2>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
              <span className="text-sm">Select or enter your shipping address</span>
            </label>
            <select
              id="address"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            >
              <option value="">Select an Address</option>
              {savedAddresses.map((addr, index) => (
                <option key={index} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your shipping address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash On Delivery</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
<div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/3 mt-6 lg:mt-0 border border-gray-200">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

  <div className="text-gray-600 text-lg space-y-4">
    <div className="flex justify-between">
      <p>Total Items:</p>
      <p className="font-medium">{cartItems.length}</p>
    </div>
    <div className="flex justify-between">
      <p>Bag Total:</p>
      <p className="font-medium">₹{total.toFixed(2)}</p>
    </div>
    <div className="flex justify-between">
      <p>Convenience Fee:</p>
      <p className="font-medium">₹19.00</p>
    </div>
    <div className="flex justify-between">
      <p>Delivery Fee:</p>
      <p className="font-medium">Free</p>
    </div>
    <div className="flex justify-between">
      <p>Platform Fee:</p>
      <p className="font-medium">₹29.00</p>
    </div>
    <hr className="my-4 border-gray-300" />
    <div className="flex justify-between text-xl font-semibold text-gray-900">
      <p>Order Total:</p>
      <p className="text-green-600">₹{(total + 19 + 29).toFixed(2)}</p>
    </div>
  </div>

  {/* Confirm Order Button */}
  <button
    className={`w-full py-3 px-6 mt-6 rounded-lg font-medium text-white transition duration-300 ease-in-out ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-800 active:bg-green-600"
    }`}
    onClick={handlePlaceOrder}
    disabled={loading}
  >
    {loading ? "Placing Order..." : "Confirm Order"}
  </button>
</div>

      </div>
    </div>
  );
}
