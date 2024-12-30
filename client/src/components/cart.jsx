import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId._id !== productId)
        );
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
          
        </div>
        ) : (
          
          <div className="grid grid-rows-1 gap-4 w-3/4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.map((item) => {
              const product = item.productId;
              return (
                <div
                  key={product?._id || item._id}
                  className="bg-white shadow  flex justify-between rounded-lg p-4 border border-gray-200"
                >
                  <div className="image-sec">
                    <img
                      onClick={() => product && navigate(`/product/${product._id}`)}
                      src={
                        product?.product_images?.length > 0
                          ? `http://localhost:4000/${product.product_images[2]}`
                          : "./public/images/default-image.png"
                      }
                      alt={product?.title || "Product Image"}
                      className="object-cover h-36"
                    />
                  </div>
                  <div className="title ">
                    <h2 className="text-lg font-semibold capitalize mt-1">
                      {product?.title || "Product not available"}
                    </h2>
                    <div className="flex items-center mt-2">
                      <button
                        className="px-2 py-1 font-bold  bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <span className="mx-4">{item.quantity}</span>
                      <button
                        className="px-2 py-1 font-bold bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-600 mt-3 font-bold bg-blue-100 px-2 w-fit">
                      RS. {(product.price).toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="delete-cart">
                    <button
                      onClick={() => product && removeItemFromCart(product._id)}
                      className="px-2 py-1 mt-0 rounded-full text-red-600 border-2 border-red-600 font-semibold hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 active:bg-red-700 transition duration-200"
                    >
                      <FontAwesomeIcon icon={faTrash} size="md" />
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
        <div className="w-full lg:w-1/3 h-fit bg-slate-50 shadow rounded-lg p-5 border border-gray-200 mt-4 lg:mt-12">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="text-gray-700 text-lg">
            <p>
              Total Items: <span className="font-bold">{cartItems.length}</span>
            </p>
            <p className="mt-2">
              Total Amount:{" "}
              <span className="font-bold text-red-600">
                RS. {calculateTotal().toFixed(2)}
              </span>
            </p>
          </div>
          <button
  className="mt-4 w-full bg-red-800 text-white py-2 rounded hover:bg-red-900"
  onClick={() => navigate('/Checkout', { state: { cartItems, total: calculateTotal() } })}
>
  Proceed to Checkout
</button>

        </div>
      )}
    </div>
  );
}
