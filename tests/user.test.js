const app=require("../src/app")
const request=require("supertest")
const User=require("../src/models/User")
const {userOneId,userOne,setUpDatabase}=require("./fixtures/db")

beforeEach(setUpDatabase)
test("Sign up test",async ()=>{
    await request(app).post("/users").send({
        name:"Roaa Ali",
        email:"roaahedaya@gmail.com",
        password:"123456"
    }).expect(201)
})
test("Log in user",async()=>{
  const response=  await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user=await User.findById(userOneId)

        expect(response.body.token).toBe(user.tokens[1].token)
})
test("Log in user fail",async()=>{
    await  request(app).post('/users/login').send({
      email:userOne.email,
      password:"123456"
    }).expect(400)
})
test("Delete user test",async()=>{
    await  request(app).delete('/users/me')
         .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
         .send()
         .expect(200)
         const user=await User.findById(userOneId)
         expect(user).toBeNull()
})
test("Delete user without authorization test",async()=>{
    await request(app).delete('/users/me').send().expect(401)
})

test("Get profile test",async()=>{
   await  request(app).get('/users/myprofile')
                       .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                       .send().expect(200)
        
})

test("Get profile without authorization test",async ()=>{
    await request(app).get('/users/myprofile')
                       .send().expect(401)
})

test("Uploading avatar test",async()=>{
    await request(app).post('/users/me/avatar')
                      .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                      .attach('avatar','tests/fixtures/MyPicture.jpg')
                      .expect(200)
})

test("Updating user profile with valid  fields test",async()=>{
    await request(app).patch('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send({
                        name:"Ali Ragab Hedaya",
                       
                    })
                    .expect(200)
                    const user=User.findById(userOneId)

                    expect(user.name).not.toBe(userOne.name)
})

test("Updating user profile with unvalid fields test",async()=>{
    await request(app).patch('/users/me')
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send({
                        task:"Do some test cases"
                    })
                    .expect(400)
})

