const express = require("express");
const cors = require("cors");
const apiRoutes = require("./modules/api_routes");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hostel Management Backend API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
