const mongoose=require("mongoose")

const userDetailsSchema=new mongoose.Schema({
   fname:String,
   email:{type:String,unique:true},
   phone:String,
   password:String
},{
    collection:"userInfo",
});
mongoose.model("userInfo",userDetailsSchema);