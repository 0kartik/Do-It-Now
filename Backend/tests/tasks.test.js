import request from "supertest"
import app from "../app.js"
import { connectTestDb, closeTestDb, clearTestDb } from "./setup.js"

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

async function getAuthCookies() {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ name: "Test User", email: "test@mail.com", password: "123456" })
  return res.headers["set-cookie"]
}

describe("Tasks API", () => {
  it("blocks access without auth cookies", async () => {
    const res = await request(app).get("/api/v1/tasks")
    expect(res.statusCode).toBe(401)
  })

  it("creates and fetches tasks for the authenticated user", async () => {
    const cookies = await getAuthCookies()

    const createRes = await request(app)
      .post("/api/v1/tasks")
      .set("Cookie", cookies)
      .send({ title: "Integration Test Task", priority: "high" })
    expect(createRes.statusCode).toBe(201)
    expect(createRes.body.priority).toBe("high")

    const fetchRes = await request(app).get("/api/v1/tasks").set("Cookie", cookies)
    expect(fetchRes.statusCode).toBe(200)
    expect(fetchRes.body.data.length).toBe(1)
    expect(fetchRes.body.total).toBe(1)
  })

  it("filters tasks by search term", async () => {
    const cookies = await getAuthCookies()

    await request(app).post("/api/v1/tasks").set("Cookie", cookies).send({ title: "Buy groceries" })
    await request(app).post("/api/v1/tasks").set("Cookie", cookies).send({ title: "Write report" })

    const res = await request(app)
      .get("/api/v1/tasks")
      .query({ search: "groceries" })
      .set("Cookie", cookies)

    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0].title).toBe("Buy groceries")
  })
})
