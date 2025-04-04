import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from a .env file into process.env
import cookieParser from "cookie-parser"; // Middleware to parse cookies from the request
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const port = process.env.PORT || 5000; // Default port is 5000

connectDB(); // Connect to the MongoDB database

// Create an express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); // Parse raw JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)

// Middleware to parse cookies from the request
app.use(cookieParser());

// Create a route for the homepage
app.get("/", (req, res) => {
  res.send("API is running...");
});

// the /api/products route is handled by the productRoutes router
app.use("/api/products", productRoutes); // Use product routes
app.use("/api/users", userRoutes); // Use user routes

// Middleware to handle errors for routes that are not found
app.use(notFound);

// Middleware to handle errors for all routes
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
