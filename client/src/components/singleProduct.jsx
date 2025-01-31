import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {  toast, ToastContainer } from "react-toastify";
import { addToCart,fetchCartItems } from './cartUtil'; // Import the shared addToCart utility
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo,faExchange} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import SubNav from "./subNav";
const baseUrl = 'http://localhost:4000';


export default function ProductDetails() {
  const { id } = useParams();
  const [blockReason, setBlockReason] = useState("");  // Store block reason
  const [isBlockFormVisible, setIsBlockFormVisible] = useState(false);  // Control the visibility of the block form
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // State for existing reviews
  const [rating, setRating] = useState(0); // State for star rating
  const [comment, setComment] = useState(''); // State for review comment
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const token = localStorage.getItem('authToken'); // Get the token from localStorage
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate =useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Get userId from localStorage
    if (userId) {
      setLoggedInUserId(userId); // Set the userId if it exists in localStorage
    }
  }, []);
  useEffect(() => {
    // Get user type from localStorage and sync it to state
    const storedUserType = localStorage.getItem("user_type");
    setUserType(storedUserType);
  }, []);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        
        const response = await axios.get(`${baseUrl}/product/${id}`);
        setProduct(response.data);
        if (response.data.product_images && response.data.product_images.length > 0) {
          setMainImage(response.data.product_images[0]); // Set first image as the default main image
        }
        fetchSimilarProducts(response.data.category);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]
);
useEffect(() => {
  const fetchCart = async () => {
    try {
      await fetchCartItems(token, setCartItems); // Fetch cart items on component load
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  fetchCart();
}, [token]);


const isInCart = (id) => {
  
  return cartItems.includes(id); // Directly check for the ID
};


const handleAddToCart = (productId) => {
  addToCart(productId, token, setCartItems);
};

  useEffect(() => {
    
    
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(`${baseUrl}/reviews/${id}`);
        setReviews(reviewsResponse.data.data||[]);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reviews.');
      }
      finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

   // Handle submitting a new review
   const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        setError('You must be logged in to add a review.');
        return;
      }

      
      console.log(searchQuery)
      const newReview = { rating, comment, productId:id };
      const response = await axios.post(`${baseUrl}/reviews`, newReview,{
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
      );

      // Update reviews list with the new review
      setReviews((prevReviews) => [...prevReviews, response.data.data]);
      console.log(reviewLoading)

      setRating(0); // Reset rating
      setComment(); // Reset comment
      setError(null); // Clear any errors
    } catch (err) {
      console.error(err);
      setError('Failed to add review. Please try again.');
    }
  };

   // Fetch similar products based on category
   const fetchSimilarProducts = async (category) => {
    try {
      const response = await axios.get(`${baseUrl}/products/category/${category}`);
      setSimilarProducts(response.data.data); // Save similar products
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  };

  const handleBlockProduct = async () => {
    try {
      if (!blockReason) {
        toast.warning("Please provide a reason for blocking.");
        return;
      }
  
      const response = await axios.put(
        `${baseUrl}/blockProduct/${id}`, 
        { reason: blockReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Product has been blocked successfully.");
        setIsBlockFormVisible(false);  // Hide the block form after submission
        // Optionally, you can update the product status in the UI here.
      }
    } catch (error) {
      console.error("Error blocking the product:", error);
      toast.error("Failed to block the product. Please try again.");
    }
  };
  

  const handleBuyNow = () => {
    if (userType !== "674ddd8ada8e8225185e33b6") {
    navigate("/Checkout", {
      state: {
        cartItems: [
          {
            productId: product,
            quantity: 1,
          },
        ],
        total: product.price,
      },
    });
  }
  };

  

  if (loading) return <p>Loading...</p>;
  
  if (error) return <p className="text-red-500">{error}</p>;

  

 
  
  

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Display stars based on the rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  // Calculate average rating for display
  const averageRating = calculateAverageRating();

  return (
    <div className="div"><SubNav onSearch={setSearchQuery}/>
    <div className="container-fluid mx-auto px-4 py-8 bg-white h-screen font-serif">
      
      <ToastContainer />
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center capitalize mb-8">{product.title}</h1>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-8">
        
       {/* Product Images */}
<div className="flex ml-20  items-start">
  {/* State for Main Image */}
  {product.product_images && product.product_images.length > 0 ? (
    <>
    {/* Thumbnail Gallery */}
      <div className="flex gap-2 flex-col overflow-x-auto">
        {product.product_images.map((image, index) => (
          <img
            key={index}
            src={`${baseUrl}/${image}`}
            alt={`${product.title} - Thumbnail ${index + 1}`}
            className={`w-20 h-20 object-cover rounded-md shadow-md border ${
              mainImage === image ? 'border-black' : 'hover:border-black'
            } cursor-pointer`}
            onClick={() => setMainImage(image)} // Update main image on click
          />
        ))}
      </div>
      {/* Main Image */}
      <div className="w-full  ml-5 mb-4">
        <img
          src={`${baseUrl}/${mainImage}`}
          alt={`${product.title} - Main Image`}
          className="w-auto shadow-md h-96 object-cover rounded-md border"
        />
      </div>

      
    </>
  ) : (
    <p className="text-gray-500">No images available</p>
  )}
</div>



        {/* Product Details */}
        <div>
          {/* Pricing and Discounts */}
          <div className="mb-4">
            <p className="text-2xl font-semibold text-red-600">
              ₹ {product.price}
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-lg ml-2">₹ {product.originalPrice}</span>
              )}
              {product.discount && <span className="text-green-500 ml-2">{product.discount}% off</span>}
            </p>
          </div>

          {/* Category */}
          <p className="text-gray-700 mb-4 font-mono">
            <strong className="font-sans">Category:</strong> {product.category}
          </p>

          {/* Description */}
          <div>
      <p className="text-gray-700 mb-4 font-mono">
        <strong className="font-sans">Description:</strong>{" "}
        <span>
          {product.description && product.description.length > 100 ? (
            <span>
              {showFullDescription
                ? product.description
                : `${product.description.slice(0, 100)}...`}
              <button
                className="text-blue-600 font-semibold ml-2 hover:underline"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            </span>
          ) : (
            product.description || "No description available"
          )}
        </span>
      </p>
    </div>

          {/* Stock Status */}
          <div className="text-black flex gap-3 mb-4">
            {product.stock === 0 || product.stock == null ? (
              <p className="text-red-600 font-semibold">Out Of Stock</p>
            ) : (
              <p className="text-green-600 font-semibold">
                In Stock: <span className="font-sans">{product.stock}</span>
              </p>
            )}
          </div>

          

          {/* Action Buttons */}
          <div className="flex flex-col ml-36">
            {/* Check if token exists in localStorage */}
  {localStorage.getItem("authToken") && (
    <>

            {/* Block Product Button (visible only to admin) */}
            {userType === "674ddd8ada8e8225185e33b6" && (  
              <button
                onClick={() => setIsBlockFormVisible(true)}  // Show the block reason form when clicked
                className="w-2/3 py-2 bg-white text-red-600 border-2 border-red-600 font-semibold rounded-md hover:text-white hover:bg-red-700"
              >
                Block Product
              </button>
            )}
            {isBlockFormVisible && (
  <div className="mt-4 p-4 border rounded-md bg-gray-50">
    <h3 className="text-xl font-semibold mb-2">Block Product</h3>
    <label htmlFor="blockReason" className="block text-gray-700">Reason for blocking:</label>
    <textarea
      id="blockReason"
      value={blockReason}
      onChange={(e) => setBlockReason(e.target.value)}
      className="w-full border rounded p-2"
      rows="4"
      placeholder="Provide a reason for blocking this product..."
    ></textarea>
    <div className="mt-4">
      <button
        onClick={handleBlockProduct}
        className="bg-white text-red-600 border-2 border-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Submit
      </button>
      <button
        onClick={() => setIsBlockFormVisible(false)}  // Hide the form if cancelled
        className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Cancel
        </button>
        </div>
      </div>
    )}

            {userType !== "674ddd8ada8e8225185e33b6"&&loggedInUserId && loggedInUserId === product.userId  && (  
              <button
              onClick={() => navigate(`/edit-product/${product._id}`)}  // Show the block reason form when clicked
                className="w-2/3 py-2 bg-white text-black border-2 border-black font-semibold rounded-md hover:text-white hover:bg-black"
              >
                Update Product
              </button>
            )}

          {userType !== "674ddd8ada8e8225185e33b6" && loggedInUserId && loggedInUserId !== product.userId &&(
            <button
              onClick={handleBuyNow}
              className={`w-2/3 py-2 bg-black text-white font-semibold rounded-md ${
                product.stock === 0
                  ? "bg-black text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
              disabled={product.stock === 0} // Disable the button when out of stock
            >
              Buy Now
            </button>
          )}
            {userType !== "674ddd8ada8e8225185e33b6" &&loggedInUserId && loggedInUserId !== product.userId && (
  <button
    className={`w-2/3 mt-2 font-semibold py-2 border border-gray-300 rounded-md text-gray-800 ${
      product.stock === 0
        ? "cursor-not-allowed bg-gray-200"
        : isInCart(product._id)
        ? "bg-green-500 text-white hover:bg-green-600"
        : "hover:bg-gray-200"
    }`}
    disabled={product.stock === 0}
    onClick={() => {
      if (isInCart(product._id)) {
        navigate('/cart'); // Redirect to cart if already in cart
      } else {
        handleAddToCart(product._id); // Add to cart
      }
    }}
  >
    {isInCart(product._id) ? "Go to Cart" : "Add to Cart"}
  </button>
)}
</>
  )}

          </div>

          <div className="w-full h-0.5 mt-5 bg-slate-100"></div>

          <div className="flex items-center gap-6 mt-6">
          <div className="flex flex-col items-center bg-blue-50 p-5">
          <FontAwesomeIcon icon={faUndo} className="w-5 h-5 text-gray-700 " />
            <p className="text-sm font-medium text-gray-600">15 days return</p>
          </div>
          <div className="flex flex-col items-center bg-blue-50 p-5">
          <FontAwesomeIcon icon={faExchange} className="w-5 h-5 text-gray-700" />

            <p className="text-sm font-medium text-gray-600">15 days exchange</p>
          </div>
        </div>
{/* 
        <div className="mt-10">
          <p className=" font-bold text-md font-sans text-gray-800">
            Check Delivery Availability
          </p>
          <div className="flex  items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter Pincode"
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Check
            </button>
          </div>
        </div> */}

        
               {/* Rating and Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ratings Overview */}
          <div className="p-4 border rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-4xl font-bold text-gray-800">
                {averageRating || "0.0"}
              </p>
              <div>
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
                <p className="text-sm text-gray-500">{reviews.length} Reviews</p>
              </div>
            </div>
            {/* Rating Breakdown */}
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-2">
                <p className="text-sm font-medium">{star} ★</p>
                <div className="w-full bg-gray-200 h-2 mx-2 rounded">
                  <div
                    className="bg-yellow-500 h-2 rounded"
                    style={{
                      width: `${(reviews.filter((r) => r.rating === star).length / reviews.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {reviews.filter((r) => r.rating === star).length}
                </p>
              </div>
            ))}
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                <>
                {reviews.slice(0, showReviews ? reviews.length : 2).map((review) => (
                  <div key={review._id} className="p-4 border rounded-lg shadow-sm bg-white">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <p className="ml-2 text-sm text-gray-500">
                        {review.userId?.name || "Anonymous"}
                      </p>
                    </div>
                    <p className="text-gray-800">{review.comment}</p>
                  </div>
                ))}
                {reviews.length > 2 && (
                  <button
                    className="text-blue-500 mt-4"
                    onClick={() => setShowReviews(!showReviews)}
                  >
                    {showReviews ? "Show Less" : "View All Reviews"}
                  </button>
                )}
                </>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    


       {/* Add Review Form */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleAddReview}>
          {/* Rating Input */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Rating:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <label htmlFor="comment" className="block font-semibold mb-1">
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Write your review here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
      </div>

        </div>
     
      
       {/* Similar Products Section */}
<div className="mt-12 ml-6">
  <h2 className="text-2xl font-bold ml-6 mb-6">Similar Products</h2>
  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
    {similarProducts.length > 0 ? (
      similarProducts
        .filter((similarProduct) => similarProduct._id !== id) // Exclude the current product
        .map((similarProduct) => (
          <div key={similarProduct._id} className="bg-white shadow-md rounded-md p-4">
            <img
              src={`${baseUrl}/${similarProduct.product_images[0]}`}
              alt={similarProduct.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-bold mt-2 line-clamp-1">{similarProduct.title}</h3>
            <p className="text-red-600 font-semibold">₹ {similarProduct.price}</p>
            <button
              className="mt-3 w-full py-2 bg-black text-white rounded-md hover:bg-gray-800"
              onClick={() => navigate(`/product/${similarProduct._id}`)} // Use navigate here
            >
              View Product
            </button>
          </div>
        ))
    ) : (
      <p className="text-gray-500">No similar products found.</p>
    )}
  </div>
    </div>

    </div>
    </div>
    
     
  );
}
