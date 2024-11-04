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
    await mongoose.connect("mongodb+srv://deepaknegi108r:JHnixgAFz445IawB@cluster0.dbdt7.mongodb.net/couse-selling-app");

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
});  
}


 