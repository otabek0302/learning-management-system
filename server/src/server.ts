import app from "./app";
import dotenv from "dotenv";
import connectToDatabase from "./utils/database";

// Load environment variables
dotenv.config();

// Connect to the database
connectToDatabase();

// Server configuration
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
