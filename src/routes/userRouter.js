const express=require("express")
require("../db/mongoose")
const auth=require("../middleware/auth")
const User=require("../models/User")
const userRouter=express.Router()
 const multer=require('multer')
 const sharp=require('sharp')
 const {sendWelcomeEmailForUsers,sendEmailAfterDeleteAccount}=require("../email/account")
 const upload=multer({
     limits:{
         fileSize:100000
     },
     fileFilter(req,file,cb){
         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return  cb(new Error('Please upload valid file'))
         }
         cb(undefined,true)
     }
 })
userRouter.post('/users',async (req,res)=>{
    
    try{
      const newUser=new User(req.body)
      const token=await newUser.generateAuthToken()
      await newUser.save()
      sendWelcomeEmailForUsers(newUser.email,newUser.name)
      
      console.log(newUser)
      
       res.status(201).send({newUser,token})
    }
  catch(error){
      res.status(400).send(error)
    }
    
    }
)
//Get all users
userRouter.get("/users/myprofile",auth,async (req,res)=>{
    res.send(req.user)
})

//update a user  route
userRouter.patch("/users/me",auth,async (req,res)=>{
    const updates=Object.keys(req.body)
  
    try{
    
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
       await req.user.save()
   
     res.send(req.user)
    }catch(error){
      res.status(400).send(error)
    }
})

//delete a user 
userRouter.delete("/users/me",auth,async (req,res)=>{

    try{
        sendEmailAfterDeleteAccount(req.user.email,req.user.name)
           await req.user.remove()
          res.send({message:"This user is deleted",user:req.user})
    }catch(error){
        res.status(500).send(error)
    }
    
})


userRouter.post('/users/login',async (req,res)=>{
   try{
    const user=await User.findByCredentials(req.body.email,req.body.password)
     console.log(user)
    
     const token=await user.generateAuthToken()
     res.send({user,token})
   }catch(error){
       res.status(400).send(error)
   }

})

userRouter.post('/users/logout',auth,async (req,res)=>{
    try{
      req.user.tokens=req.user.tokens.filter(token=>{
          return token.token!=req.token
      })
      await req.user.save()
      res.status(200).send({message:"You are logged out succesfully"})
    }catch(error){
        res.status(500).send(error)
    }
})

userRouter.post('/users/logoutAll',auth, async (req,res)=>{
   try{
     req.user.tokens=[]
     await req.user.save()
     res.send({message:"You are logged out successfully from all accounts"})
   }catch(error){
       res.status(500).send(error)
   }
})


userRouter.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{
    const buffer= await sharp(req.file.buffer).resize({
        height:200,
        width:200
    }).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
   res.send({error:error.message})
})
userRouter.delete('/users/me/avatar',auth,async (req,res)=>{
    try{
      
     req.user.avatar=undefined
      await req.user.save()
   
      res.send({message:'Your profile picture is deleted successfuly'})
    }catch(error){
        res.send(400).send(error)
    }
})
userRouter.get('/users/:id/avatar', async (req, res) => {
    try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
    throw new Error()
    }
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
    } catch (e) {
    res.status(404).send()
    }
   })
module.exports=userRouter