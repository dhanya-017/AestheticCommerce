const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

// Store server boot time
let bootTime = Date.now();

// Add server status endpoint
app.get("/api/server-status", (req, res) => {
  res.status(200).json({ bootTime });
});

// Start server (Render will provide PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
