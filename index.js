// Import core packages
require('dotenv').config();
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Import custom modules
const connectDB = require('./src/config/db');

// Import routes
const homeRoutes = require('./src/routes/home.routes');
const authRoutes = require('./src/routes/auth.routes');
const donationRoutes = require('./src/routes/donation.routes');
const donorRoutes = require('./src/routes/donor.routes');
const ngoRoutes = require('./src/routes/ngo.routes');
const volunteerRoutes = require('./src/routes/volunteer.routes');
const adminRoutes = require('./src/routes/admin.routes');





// --------------------- INITIALIZE EXPRESS APP ---------------------
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();





// --------------------- MIDDLEWARE SETUP ---------------------
// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views')); 

// Method override middleware for PUT and DELETE requests
app.use(methodOverride('_method'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));





// --------------------- ROUTES SETUP ---------------------
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/donations', donationRoutes);
app.use('/donor', donorRoutes);
app.use('/ngo', ngoRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/admin', adminRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://hardipmuliyasiya:diphar81!@annamitracluster.ggnex67.mongodb.net/?retryWrites=true&w=majority&appName=annamitraCluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
