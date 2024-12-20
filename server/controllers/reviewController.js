const Review = require('../db/models/review');

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    console.log("Authorization Header:", authorizationHeader);

    // Extract token from header
    const token = authorizationHeader?.replace(/^Bearer\s+/i, '').trim();
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = { id: decoded.user_id }; // Add user ID to the request
        console.log("Decoded User ID:", req.user.id);
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};


// Add a review
exports.addReview =[authenticate, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    const newReview = new Review({
      productId,
      userId,
      rating,
      comment
    });

    await newReview.save();

    res.status(201).send({ message: 'Review added successfully', data: newReview });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong', error: error.message });
  }
}];

// Fetch reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate('userId', 'name');

    res.status(200).send({ data: reviews });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong', error: error.message });
  }
};
