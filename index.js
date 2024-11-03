require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const userRouter = require("./routes/users");
const courseRouter = require("./routes/course");
 const adminRouter = require("./routes/admin");
//const {userModel , adminModel , courseModel , purchaseModel} =require("./db")
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/admins", adminRouter);

async function connectDB() {
    await mongoose.connect(process.env.MongoDB_Url);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
});  
}


connectDB()