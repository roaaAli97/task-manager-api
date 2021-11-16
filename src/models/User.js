const mongoose=require("mongoose")
const {isEmail}=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
const Task=require("./task")
const userSchema=  mongoose.Schema({
    name:{
        type:String
    },
    age:{
        type:Number,
        default:0
    },
    email:{
        unique:true,
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!isEmail(value)){
                console.log("email")
                throw new Error("This email is not valid")
            }
        }

    },
    password:{

        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.includes("password")){
                throw new Error("Password can't be this value")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{timestamps:true})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.generateAuthToken=async function (){
    
  const user=this
  const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
}
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.statics.findByCredentials= async (email,password)=>{
       const user=await User.findOne({email})
       console.log(user)

       if(!user){
           console.log("hiii")
           throw new Error('unable to login')
       }

       const isMatch=await bcrypt.compare(password,user.password)
        console.log(isMatch)
       if(!isMatch){
           throw new Error ('unable to login')
       }
       return user
}
userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
     
     next()
})
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User= mongoose.model('User',userSchema)

module.exports=User