const mongoose=require("mongoose")
const User=require("../../src/models/User")
const jwt=require("jsonwebtoken")
const Task=require("../../src/models/task")
const userOneId=new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:"Ali Ragab",
    email:"alihedaya@gmail.com",
    password:"1234567",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]

}
const userTwoId=new mongoose.Types.ObjectId()
const userTwo={
    _id:userTwoId,
    name:"Ahmed Ali",
    email:"Ahmed_Ali@gmail.com",
    password:"1234567",
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}
const taskOne={
    _id:new mongoose.Types.ObjectId,
    description:"Task one",
    owner:userOneId
}

const taskTwo={
    _id:new mongoose.Types.ObjectId,
    description:"Task two",
    owner:userOneId
}
const taskThree={
    _id:new mongoose.Types.ObjectId,
    description:"Task three",
    owner:userTwoId
}

const setUpDatabase= async ()=>{
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}
module.exports={
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setUpDatabase
}