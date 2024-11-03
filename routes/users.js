const Router = require("express");
const userRouter = Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../routes/config")
const {userModel , courseModel , orderModel} =require("../db")
const {userMiddleware} = require("../middleware/user")

const usersignupSchema = z.object({
    name:z.string().min().max(28),
    email:z.string().email(),
    password:z.string().min(8).max(16).regex(/^[A-Z]/).regex(/[!@#$%^&*:"?><]/)

});
const usersigninSchema = z.object({
    email:z.string().email(),
    password :z.string().min(8).max(16).regex(/^[A-Z]/).regex(/[!@#$%^&*:"?><]/)

});



userRouter.post("/signup", async (req, res) => {
    try{
        const parsed = usersignupSchema.safeParse(req.body);
        if(!parsed.success){
         return res.status(400).json({
            message:"incorrect input"
         })
        }
        const {name , email , password} = parsed.data

        const securepass = await bcrypt.hash(password, 5);
   
       await userModel.create({
        name:name,
        email:email,
        password:securepass

       })
       res.json({
        message:"You are signed up"
       });
    }catch(e){
     res.status(404).json({
        message:"Signup Failed"
     })

    }
});

userRouter.post("/signin", async (req, res) => {
    try{
        const parsed = usersigninSchema.safeParse(req.body);
        const {email , password} = parsed.data;
        const user = await userModel.findOne({
            email
        });
        if(!user){
            return res.status(404).json({
                message:"user not found"

            });
        }

        const passmatch = await bcrypt.compare(password,user.password);

        if(!passmatch){
           return res.status(401).json({
                message:"invalid pass",
                error:e.message
            })
        }
        const token = jwt.sign({
            id:user._id

        },JWT_user_SECRET)
        res.json({
           token:token
        })

    }catch(e){
        console.error(e.message)
    };


});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    // let purchasedCourseIds = [];

    // for (let i = 0; i<purchases.length;i++){ 
    //     purchasedCourseIds.push(purchases[i].courseId)
    // }

    // const coursesData = await courseModel.find({
    //     _id: { $in: purchasedCourseIds }
    const purchasedCourseIds = purchases.map(purchase => purchase.courseId);

    const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds }
     });



    res.json({
        purchases,
        coursesData
    })
})


userRouter.get("/course",async (req , res)=>{
    
})

module.exports = userRouter;