import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import SubNav from "./subNav";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHomePath = () => {
    const usertype = localStorage.getItem('user_type');
    if (usertype === '6738b70b20495c12314f4c4f') {
      return '/sellerHome'; // Seller home
    } 
    else {
      return '/home'; // Default home
    }  };

    
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/viewCart", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        if (response.data?.items && Array.isArray(response.data.items)) {
          setCartItems(response.data.items.filter((item) => item?.productId));
        } else {
          setError("Failed to fetch cart items.");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item?.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:4000/updateCartQuantity`, // Backend endpoint for quantity update
        { productId, quantity }, // Send productId and new quantity
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
       
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId._id === productId ? { ...item, quantity } : item
          )
        );
      } 
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const removeItemFromCart = async (productId) => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      setError("No token found. Please login.");
      return;
    }
  
    try {
      // Send a request to the backend to remove the item
      const response = await axios.delete(
        `http://localhost:4000/deleteCart/${productId}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Removed from cart");
  
        // Update the cart state by removing the item from the frontend
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId._id !== productId)
        );
  
        // Optionally, update the localStorage to reflect the cart changes
        const updatedCartItems = cartItems.filter(
          (item) => item.productId._id !== productId
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item. Please try again.");
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="div">
      <SubNav />
    <div className="container-fluid h-screen bg-white mx-auto p-4 flex flex-col lg:flex-row lg:justify-between">
      <ToastContainer />
      
      <div className="w-full ">
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col  items-center justify-center  text-center mt-20">
          <FontAwesomeIcon
            icon={faShoppingBasket}
            className="text-gray-900 text-6xl mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-4">
            Looks like you havent added anything to your cart yet.
          </p>
          <button
                      // onClick={getHomePath()}
                      className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900"
                    >
                      <Link to={getHomePath()} className="">Start Shopping</Link>
                    </button>
          
        </div>
        ) : (
          
          <div className="grid grid-rows-1 gap-4 w-3/4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.map((item) => {
              const product = item.productId;
              return (
                <div
  key={product?._id || item._id}
  className="bg-white shadow-md rounded-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex items-center gap-4"
>
  {/* Product Image */}
  <div className="flex-shrink-0 w-24 h-24">
    <img
      onClick={() => product && navigate(`/product/${product._id}`)}
      src={
        product?.product_images?.length > 0
          ? `http://localhost:4000/${product.product_images[2]}`
          : "./public/images/default-image.png"
      }
      alt={product?.title || "Product Image"}
      className="w-full h-full object-contain rounded-md cursor-pointer hover:opacity-90"
    />
  </div>

  {/* Product Details */}
  <div className="flex-grow">
    {/* Product Title */}
    <h2
      className="text-base font-semibold text-gray-800 capitalize truncate hover:text-red-600 cursor-pointer"
      onClick={() => product && navigate(`/product/${product._id}`)}
    >
      {product?.title || "Product not available"}
    </h2>

    {/* Price Section */}
    <div className="flex items-center space-x-2 mt-2">
      <span className="text-lg font-bold text-gray-900">
        ₹{product?.price?.toFixed(2) || "0.00"}
      </span>
      {product?.original_price && (
        <span className="text-sm line-through text-gray-500">
          ₹{product.original_price.toFixed(2)}
        </span>
      )}
      {product?.discount && (
        <span className="text-xs text-white bg-red-500 px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}
    </div>

    {/* Quantity Section */}
    <div className="flex items-center space-x-4 mt-3">
      <button
        className="px-2 py-1 text-sm font-bold text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
        onClick={() =>
          updateQuantity(product._id, Math.max(1, item.quantity - 1))
        }
      >
        -
      </button>
      <span className="text-base font-semibold">{item.quantity}</span>
      <button
        className="px-2 py-1 text-sm font-bold text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
        onClick={() => updateQuantity(product._id, item.quantity + 1)}
      >
        +
      </button>
    </div>
  </div>

  {/* Actions Section */}
  <div className="flex flex-col items-end space-y-3">
    {/* Delete Button */}
    <button
      onClick={() => product && removeItemFromCart(product._id)}
      className="px-3 py-1 text-sm text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
    >
      <FontAwesomeIcon icon={faTrash} className="mr-1" />
      Remove
    </button>
  </div>
</div>

              );
            })}
          </div>
        )}
      </div>

 {/* order summary */}

 {cartItems.length > 0 && (
  <div className="w-full lg:w-1/3 h-fit bg-gradient-to-b from-gray-50 to-gray-100 shadow-lg rounded-xl p-6 border border-gray-200 mt-6 lg:mt-12">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
      <div className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
        {cartItems.length} Item{cartItems.length > 1 ? "s" : ""}
      </div>
    </div>

    {/* Order Details */}
    <div className="space-y-5">
      <div className="flex justify-between items-center text-gray-700">
        <span className="text-md">Subtotal:</span>
        <span className="font-bold text-gray-900">₹ {calculateTotal().toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-gray-700">
        <span className="text-md">Shipping:</span>
        <span className="font-medium text-green-600">Free</span>
      </div>
      <div className="flex justify-between items-center text-gray-700 border-t pt-4">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-lg font-bold text-red-600">
          ₹ {calculateTotal().toFixed(2)}
        </span>
      </div>
    </div>

    {/* Divider */}
    <hr className="my-6 border-gray-300" />

    {/* Proceed Button */}
    <button
      className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300"
      onClick={() => navigate('/Checkout', { state: { cartItems, total: calculateTotal() } })}
    >
      Proceed to Checkout
    </button>
  </div>
)}

    </div>
    </div>
  );
}
