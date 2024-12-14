const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

// Allow all origins by default
app.use(cors());

// Middleware to parse incoming requests
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Database connection
const mongoConnect = require('./db/connect');
mongoConnect();

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoute = require('./routes/cartRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const orderRoute = require('./routes/orderRoute');


// Test Route
app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

// **Static File Serving**
// Serve static files from the "uploads" directory
app.use('/uploads', express.static ('./uploads'));

// Ensure your client is served correctly if needed
app.use(express.static(path.join(__dirname, '../client')));

// Register API routes
app.use(userRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoute);
app.use(wishlistRoute);
app.use(orderRoute)

// Error handling for invalid routes
app.use((req, res) => {
    res.status(404).send({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
