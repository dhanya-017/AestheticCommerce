const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');// Allow cross-origin requests

const userRoutes = require('./routes/user.routes'); 
const blogRoutes = require('./routes/blogs.routes');
const shipAddRoutes = require('./routes/shipAddress.routes');
const favortiesRoutes = require('./routes/favorites.routes');
const cartRoutes = require('./routes/cart.routes');
const productRoutes = require('./routes/product.routes'); 
const orderRoutes = require('./routes/order.routes'); 
const addressRoutes = require("./routes/address.routes");
const invoiceRoutes = require('./routes/invoice.routes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notification.routes');

// const sellerRoutes = require('./routes/seller.routes'); 

//SELLER PANEL ROUTES
const sellerPanelRoutes = require('./routes-seller-panel/SellerPanel.routes');
const addProductRoutes = require("./routes-seller-panel/addProduct.routes");
const dashboardRoutes = require('./routes-seller-panel/dashboard.routes');
const productInfoRoutes = require("./routes-seller-panel/productInfo.routes");
const statsRoutes = require("./routes-seller-panel/stats.routes");

//ADMIN PANEL ROUTES
const adminRoutes = require("./routes-admin-panel/admin.routes");

const connectDB = require('./db/db'); 
connectDB(); // Connect to MongoDB
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/check', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes); 
app.use('/users',shipAddRoutes);
app.use('/users',blogRoutes);
app.use('/users',favortiesRoutes);
app.use('/users',cartRoutes);
app.use('/products', productRoutes); 
app.use("/api/orders", orderRoutes); 

//DOCUMENTS
app.get('/api/document', (req, res) => {
  res.send('Hello document!');
});
app.use("/api/document", invoiceRoutes);
app.use("/api/addresses", addressRoutes);
app.use('/api', contactRoutes);
app.use('/api/notifications', notificationRoutes);

// app.use('/seller', sellerRoutes); 


// Seller Panel Routes
app.use("/api/products", addProductRoutes); 
app.use("/api/seller", sellerPanelRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/productinfo", productInfoRoutes);
app.use("/api/stats", statsRoutes);

// Admin Panel Routes
app.use("/api/admin", adminRoutes);


module.exports = app;