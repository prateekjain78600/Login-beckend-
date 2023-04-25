const express= require('express')
const app=express();
app.use(express.json());
const mongoose= require("mongoose");
const cors=require('cors')
app.use(cors());
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken')
const jwt_secret="hbjgadajgjablhghebghbae?jvjds()ndsbd?[]ksjdgjadnsdjvbds"

// connection creation and creating a new database
mongoose.connect("mongodb://127.0.0.1:27017/prateekdata",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connection successfull"))
.catch((err)=>console.log(err));

require("./userDetails");
const User=mongoose.model("userInfo");


app.post('/register',async(req,res)=>{
    const{fname,email,phone,password}=req.body;
    const encrpyted=await bcrypt.hash(password,10);
    try {
        const oldUser= await User.findOne({email})
        if(oldUser){
           return res.send({error:"User Exists"})
        }
        await User.create({
            fname,
            email,
            phone,
            password:encrpyted,
        });
        res.send({status:"ok"});
    } catch (error) {
        res.send({status:"error"})
    }
})

app.post("/login-user",async(req,res)=>{
    const{email,password}=req.body;

    const user=await User.findOne({email});
    if(!user){
        return res.json({error:"user not found"});
    }
    if(await bcrypt.compare(password,user.password)){
        const token =jwt.sign({},jwt_secret);
        if(res.status(201)){
            return res.json({status:"ok",data:token})
        }
        else{
            return res.json({error:"errror"})
        }
    }
    res.json({status:"error",error:"invalid password"})

})
app.post('/userData',(req,res)=>{
    const{token}=req.body;
    try {
        const user=jwt.verify(token,jwt_secret);
        const useremail=user.email;
        User.findOne({email:useremail}).then((data)=> {
            res.send({status:"ok",data:data});
        }).catch((error)=>{
            res.send({status:"error",data:error})
        });
    } catch (error) {
        
    }
})

app.listen(5000,()=>{
    console.log("server started");
})

