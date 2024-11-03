const mongoose = require("mongoose");
const { type } = require("os");

const Schema  = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name:String,
    email:{type:String,unique:true},
    password:String
});
const courseSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    price:Number
});
const adminSchema = new Schema({
    name:String,
    email:{type:String,unique:true},
    password:String
});
const orderSchema = new Schema({
    user:ObjectId,
    course:ObjectId,
    price:Number,
    date:Date,
    status:String
});
const userModel = mongoose.model("user", userSchema);
const courseModel = mongoose.model("course", courseSchema);
const adminModel = mongoose.model("admin", adminSchema);
const orderModel = mongoose.model("order", orderSchema);

module.exports = {
    userModel,
    courseModel,
    adminModel,
    orderModel
};