import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = 'http://localhost:4000';

export const addToCart = async (productId, token, setCartItems) => {
  if (!token) {
    toast.error('Please login to add to cart');
    return;
  }

  try {
    const response = await axios.post(
      `${baseUrl}/addCart`,
      { productId },
      { headers: { Authorization: `bearer ${token}` } }
    );

    

    // Update cartItems with the product IDs from the updated cart
    const updatedCartItems = response.data.cart.items.map((item) => item.productId);
    setCartItems(updatedCartItems);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || 'Error adding to cart'
    );
  }
};

export const fetchCartItems = async (token, setCartItems) => {
  if (!token) {
    setCartItems([]); // Clear cart if user is not logged in
    return;
  }

  try {
    const response = await axios.get(`${baseUrl}/viewCart`, {
      headers: { Authorization: `bearer ${token}` },
    });

    // Log the response for debugging
    // console.log("Cart API Response:", response.data);

    // Filter out invalid items where productId is null
    const validItems = response.data?.items?.filter(
      (item) => item.productId && typeof item.productId === "object"
    ) || [];

    // Map valid product IDs
    const cartItems = validItems.map((item) => item.productId._id);
    setCartItems(cartItems); // Update the state with the filtered cart items
  } catch (error) {
    console.error("Error fetching cart items:", error);
    setCartItems([]); // Clear cart items if an error occurs
  }
};



