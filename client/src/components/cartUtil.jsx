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

    toast.success('Product added to cart successfully');
    setCartItems((prevItems) => [...prevItems, response.data.cart.items]);
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || 'Error adding to cart'
    );
  }
};
