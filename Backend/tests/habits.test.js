import request from "supertest"
import app from "../app.js"
import Habit from "../Models/Habit.js"
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

describe("Habits API", () => {
  it("creates a habit and completing it sets streak to 1", async () => {
    const cookies = await getAuthCookies()

    const createRes = await request(app)
      .post("/api/v1/habits")
      .set("Cookie", cookies)
      .send({ name: "Read for 20 minutes" })
    expect(createRes.statusCode).toBe(201)
    expect(createRes.body.streak).toBe(0)

    const completeRes = await request(app)
      .patch(`/api/v1/habits/${createRes.body._id}/complete`)
      .set("Cookie", cookies)
    expect(completeRes.statusCode).toBe(200)
    expect(completeRes.body.streak).toBe(1)
  })

  it("completing twice in the same day does not double the streak", async () => {
    const cookies = await getAuthCookies()

    const createRes = await request(app)
      .post("/api/v1/habits")
      .set("Cookie", cookies)
      .send({ name: "Meditate" })

    await request(app)
      .patch(`/api/v1/habits/${createRes.body._id}/complete`)
      .set("Cookie", cookies)

    const secondCompleteRes = await request(app)
      .patch(`/api/v1/habits/${createRes.body._id}/complete`)
      .set("Cookie", cookies)

    expect(secondCompleteRes.body.streak).toBe(1)
  })

  it("allows one grace day before breaking the streak", async () => {
    const cookies = await getAuthCookies()

    const createRes = await request(app)
      .post("/api/v1/habits")
      .set("Cookie", cookies)
      .send({ name: "Stretch" })

    const habitId = createRes.body._id

    await Habit.findByIdAndUpdate(habitId, {
      streak: 5,
      graceUsed: false,
      lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    })

    const completeRes = await request(app)
      .patch(`/api/v1/habits/${habitId}/complete`)
      .set("Cookie", cookies)

    expect(completeRes.body.streak).toBe(6)
    expect(completeRes.body.graceUsed).toBe(true)
  })

  it("breaks the streak if the grace day was already used", async () => {
    const cookies = await getAuthCookies()

    const createRes = await request(app)
      .post("/api/v1/habits")
      .set("Cookie", cookies)
      .send({ name: "Journal" })

    const habitId = createRes.body._id

    await Habit.findByIdAndUpdate(habitId, {
      streak: 5,
      graceUsed: true,
      lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    })

    const completeRes = await request(app)
      .patch(`/api/v1/habits/${habitId}/complete`)
      .set("Cookie", cookies)

    expect(completeRes.body.streak).toBe(1)
  })

  it("paginates and filters habits by search term", async () => {
    const cookies = await getAuthCookies()

    await request(app).post("/api/v1/habits").set("Cookie", cookies).send({ name: "Read books" })
    await request(app).post("/api/v1/habits").set("Cookie", cookies).send({ name: "Run 5k" })

    const res = await request(app)
      .get("/api/v1/habits")
      .query({ search: "read" })
      .set("Cookie", cookies)

    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0].name).toBe("Read books")
  })
})
