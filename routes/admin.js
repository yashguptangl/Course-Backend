const express = require("express");
const adminRouter = express.Router();
const {z} = require("zod");67744
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} =require("./config");
const {adminModel,courseModel} = require("../db");
const {adminMiddleware} = require("../middleware/admin")


const adminsignupSchema = z.object({
    name:z.string().min().max(28),
    email:z.string().email(),
    password:z.string().min(8).max(16).regex(/^[A-Z]/).regex(/[!@#$%^&*:"?><]/)

});

const adminsigninSchema = z.object({
    email:z.string().email(),
    password :z.string().min(8).max(16).regex(/^[A-Z]/).regex(/[!@#$%^&*:"?><]/)

});



adminRouter.post("/signup", async (req, res) => {
    try{
        const parsed = adminsignupSchema.safeParse(req.body);
        if(!parsed.success){
         return res.status(400).json({
            message:"incorrect input"
         })
        }
        const {name , email , password} = parsed.data

        const securepass = await bcrypt.hash(password, 5);
   
       await adminModel.create({
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

adminRouter.post("/signin", async (req, res) => {
    try{
        const parsed = adminsigninSchema.safeParse(req.body);
        const {email , password} = parsed.data;
        const admin = await adminModel.findOne({
            email
        });
        if(!admin){
            return res.status(404).json({
                message:"admin not found"

            });
        }

        const passmatch = await bcrypt.compare(password,admin.password);

        if(!passmatch){
           return res.status(401).json({
                message:"invalid pass",
                error:e.message
            })
        }
        const token = jwt.sign({
            id:admin._id

        },JWT_ADMIN_SECRET)
        res.json({
           token:token
        })

    }catch(e){
        console.error(e.message)
    };


});

adminRouter.post("/course",adminMiddleware ,async (req , res)=>{
    const adminid = req.userid;

    const {title , description ,imageUrl,price}= req.body;
    
    try{
        const course = await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creator:adminid
        });
        
        res.json({
            message:"course added",
            courseId:course._id,
            
        })
  
    }catch(e){
        res.status(400).json({
            message:"course not created"
        })

    }

});

adminRouter.put("/course",adminMiddleware,async (req , res)=>{
    const adminid = req.userid;
    const {title ,description , imageUrl,price, courseId} = req.body
    try{
        const course = await courseModel.findByIdAndUpdate({
         _id:courseId,
         creator:adminid
        },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
        })
        res.json({
        message:"course updated",
        courseId:course._id
        });
    }catch(e){
        res.status(400).json({
            message:"Course not updated"
        })
    }

});


adminRouter.get("/course/get", adminMiddleware, async (req, res) => {
    const adminid = req.userid;

    try {
        const courses = await courseModel.find({ creator: adminid });
        res.status(200).json({ courses });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = adminRouter;
