import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = 'http://localhost:4000';

// Add to Wishlist
export const addToWishlist = async (productId, token, setWishlistItems) => {
  if (!token) {
    toast.error('Please login to add to wishlist');
    return;
  }

  try {
    const response = await axios.post(
      `${baseUrl}/addWishlist`,
      { productId },
      { headers: { Authorization: `bearer ${token}` } }
    );

    // Assume the API returns the updated wishlist or just the product ID added
    const updatedWishlist = response.data.wishlist.fav.map((item) => item.productId);

    setWishlistItems(updatedWishlist); // Set the updated wishlist
    toast.success('Product added to wishlist!');
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || 'Failed to add to wishlist'
    );
  }
};


// Remove from Wishlist
export const removeFromWishlist = async (productId, token, setWishlistItems) => {
  if (!token) {
    toast.error('Please login to manage your wishlist');
    return;
  }

  try {
    const response = await axios.delete(`${baseUrl}/wishlist/${productId}`, {
      headers: { Authorization: `bearer ${token}` },
    });

    // Assume the API returns the updated wishlist or success confirmation
    const updatedWishlist = response.data.wishlist.fav.map((item) => item.productId);

    setWishlistItems(updatedWishlist); // Set the updated wishlist
    toast.success('Product removed from wishlist!');
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || 'Failed to remove from wishlist'
    );
  }
};

