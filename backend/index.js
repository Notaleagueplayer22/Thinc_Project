const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.route");

const app = express();



// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://sunvatnootavee:EBY6aM11A9ZsKalj@cluster0.diobn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Connection failed!", error);
    });
