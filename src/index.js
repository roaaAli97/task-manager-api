// const app=require("./app")
const express=require("express")
require("./db/mongoose")
const UserRouter=require("./routes/userRouter")
const TaskRouter=require("./routes/taskRouter")
const app=new express()
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
const port=process.env.PORT

app.listen(port,()=>{
    console.log("server is running on " +port)
})

