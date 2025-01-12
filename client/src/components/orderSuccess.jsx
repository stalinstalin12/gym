import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const { state } = useLocation(); // Order details passed from Checkout
  const navigate = useNavigate();

  // Example data structure for state (in case state is undefined)
  const { orderId, total, orderDate } = state || {
    orderId: "12345",
    total: 0,
    orderDate: new Date().toLocaleDateString(),
  };

  // Framer Motion variants
  const flipVariant = {
    hidden: { opacity: 0, rotateY: 90 }, // Initially invisible and flipped
    visible: {
      opacity: 1,
      rotateY: 0, // Rotate back to normal
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const getHomePath = () => {
    const usertype = localStorage.getItem('user_type');
    if (usertype === '6738b70b20495c12314f4c4f') {
      return '/sellerHome'; // Seller home
    } else if (usertype === '674ddd8ada8e8225185e33b6') {
      return '/adminHome'; // Admin home
    } else {
      return '/home'; // Default home
    }  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4"
      initial="hidden"
      animate="visible"
    >
      {/* Success Illustration with Flip Animation */}
      <motion.div
        className="bg-white rounded-full p-6 shadow-lg"
        variants={flipVariant}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      {/* Success Message */}
      <motion.h1
        className="text-3xl font-bold text-green-700 mt-4"
        variants={itemVariants}
      >
        Order Placed Successfully!
      </motion.h1>
      <motion.p
        className="text-gray-700 mt-2"
        variants={itemVariants}
        transition={{ delay: 0.3 }}
      >
        Thank you for shopping with us. Your order has been placed and is being
        processed.
      </motion.p>

      {/* Order Details */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 mt-6 w-full max-w-md"
        variants={itemVariants}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        <p className="text-gray-700">
          <span className="font-semibold">Order ID:</span> {orderId}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Total Amount:</span> ₹{total.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Order Date:</span> {orderDate}
        </p>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex mt-6 space-x-4"
        variants={itemVariants}
        transition={{ delay: 0.5 }}
      >
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800"
          
        >
          <li className=" list-none">
                    <Link to={getHomePath()} className="">Continue Shopping</Link>
                  </li>
        </button>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900"
          onClick={() => navigate("/myOrders")}
        >
          View Orders
        </button>
      </motion.div>
    </motion.div>
  );
}
