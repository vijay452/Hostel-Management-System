// server/modules/index.js (Main server setup)

const express = require('express');
const cors = require('cors'); // You need CORS to allow frontend (3000) to talk to backend (5000)
// ✅ Corrected code:
const apiRoutes = require('./modules/api_routes'); // Tells Node to look inside the 'modules' folder
const app = express();
const port = 5000;

// Middleware setup
app.use(cors()); // Allow all cross-origin requests
app.use(express.json()); // For handling POST/PUT data

// --- Mount the API Routes ---
// This tells the server to use all the routes defined in api_routes.js 
// starting with the path /api (e.g., /api + /rooms/list)
app.use('/api', apiRoutes); 

// Fallback for the root path (to fix the "Cannot GET /" message)
app.get('/', (req, res) => {
    res.send("Hostel Management Backend API is running!");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("CORS enabled for all origins.");
});