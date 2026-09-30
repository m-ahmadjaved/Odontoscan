require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const forensicRoutes = require("./routes/forensicRoutes");
const showAllRecordsRoute = require("./routes/showAllRecordsRoute");
const deleteAllRecordsRouter = require('./routes/deleteAllRecordsRouter');
const totalDataRoute = require('./routes/totalDataRoute');
const deleteSingleRecordRouter = require('./routes/deleteSingleRecordRoutes');
const updateSingleRecordRouter = require('./routes/updateSingleRecordRouter');
const showSingleRecordRoutes = require('./routes/showSingleRecordRoutes');
const matchRadiographRouter = require('./routes/matchRadiographRouter');
const dashboardRoutes = require('./routes/dashboard'); // Ensure this route is imported

const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/admin", adminRoutes); // Ensure adminRoutes is correctly registered
app.use("/api/auth", authRoutes);
app.use("/api/forensic", forensicRoutes);  // Register forensic routes
app.use("/api/record", showAllRecordsRoute, showSingleRecordRoutes);  // Record routes
app.use('/api', deleteAllRecordsRouter, totalDataRoute, deleteSingleRecordRouter, updateSingleRecordRouter);
app.use('/api/v1/radiographs', matchRadiographRouter);
app.use("/api/dashboard", dashboardRoutes); // Make sure this matches the route

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Database connection error:", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
