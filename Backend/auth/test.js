import request from "supertest"
import app from "../app.js"

let token

beforeAll(async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@mail.com", password: "123456" })

  token = res.body.token
})

test("Should access protected route", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${token}`)

  expect(res.statusCode).toBe(200)
})
test("Should block without token", async () => {
  const res = await request(app).get("/tasks")
  expect(res.statusCode).toBe(401)
})