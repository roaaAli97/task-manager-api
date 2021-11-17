const express=require("express")

const Task=require("../models/task")

const taskRouter=express.Router()
const auth=require("../middleware/auth")
taskRouter.post("/tasks",auth,async (req,res)=>{
    const newTask=new Task({
      owner:req.user._id,
      ...req.body
    } )
    try{
     await newTask.save()
     res.status(201).send(newTask)
    }catch(e){
      res.status(400).send(e)
    }

   
})
//get all tasks
//Get tasks?completed=true
//Get tasks?lmit=2&skip=0
//tasks?sortBy=createdAt_desc
taskRouter.get('/tasks',auth,async (req,res)=>{
    const match={}
     if(req.query.completed){
        match.completed=req.query.completed==='true'
     }
     const sort={}
     if(req.query.sortBy){
       const queryParts=req.query.sortBy.split('_')
       sort[queryParts[0]]=queryParts[1]==='desc'?-1:1
     }
    const options={
      limit:parseInt(req.query.limit),
      skip:parseInt(req.query.skip),
      sort
    }
      try{
     const tasks= await Task.find({owner:req.user.id,...match},null,options)
        res.send(tasks)
  
      }catch(e){
        res.status(400).send(e)
    }
})
//get task by id
taskRouter.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
      const task=await Task.findOne({_id,owner:req.user._id})
      if(!task){
        return  res.status(404).send()
      }
       res.send(task)
     }catch(e){
        res.status(500).send(e)
     }


})

//updata a task
taskRouter.patch("/tasks/:id",auth,async(req,res)=>{
     const userUpdates=Object.keys(req.body)
    const allowedUpdates=['description','completed']

    const validUpdate=userUpdates.every(update=>{
        return allowedUpdates.includes(update)
    })
     if(!validUpdate){
         return res.status(400).send({Error:"This update is not valid"})
     }
   const _id=req.params.id
   try{
     const updatedTask=await Task.findOne({_id,owner:req.user._id})
  
     if(!updatedTask){
        return res.status(404).send({Error:"This task doesn't exist"})     
     }
        userUpdates.forEach(update=>{
        updatedTask[update]=req.body[update]
        })
    await updatedTask.save()
        res.send(updatedTask)
   }catch(error){
      res.status(400).send(error)
   }
})
//Delete a task 
taskRouter.delete("/tasks/:id",auth,async (req,res)=>{
    const _id=req.params.id
    try{
      const deletedTask= await Task.findOneAndDelete({_id,owner:req.user._id})
      if(!deletedTask){
          return res.status(404).send({Error:"This task doesn't exist"})
      }
      res.send(deletedTask)
    }catch(error){
      res.status(500).send(error)
    }
})

module.exports=taskRouter