const app=require("../src/app")
const Task=require("../src/models/task")
const request=require("supertest")
const {userOneId,userOne,userTwo,taskOne,setUpDatabase}=require("./fixtures/db")
beforeEach(setUpDatabase)
test('Create new task',async ()=>{
    const response=await request(app).post("/tasks")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description:"Learn Mongodb"
    })

    .expect(201)
    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})
test("Get all tasks of a user",async ()=>{
    const response=await request(app).get("/tasks").set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send().expect(200)
    expect(response.body.length).toBe(2)
})
test("Delete task security test",async()=>{
  await request(app).delete(`/tasks/${taskOne._id}`)
                 .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
                  .send()
                  .expect(404)
  const task=await Task.findById(taskOne._id)

  expect(task).not.toBeNull()
})