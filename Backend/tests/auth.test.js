import request from "supertest"
import app from "../app.js"
import { connectTestDb, closeTestDb, clearTestDb } from "./setup.js"

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

describe("Auth API", () => {
  const credentials = { name: "Test User", email: "test@mail.com", password: "123456" }

  it("registers a new user and sets auth cookies", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(credentials)
    expect(res.statusCode).toBe(201)
    expect(res.body.user.email).toBe(credentials.email)
    expect(res.headers["set-cookie"].some(c => c.startsWith("accessToken="))).toBe(true)
    expect(res.headers["set-cookie"].some(c => c.startsWith("refreshToken="))).toBe(true)
  })

  it("rejects registering the same email twice", async () => {
    await request(app).post("/api/v1/auth/register").send(credentials)
    const res = await request(app).post("/api/v1/auth/register").send(credentials)
    expect(res.statusCode).toBe(409)
  })

  it("logs in and can access a protected route with the cookie", async () => {
    await request(app).post("/api/v1/auth/register").send(credentials)

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credentials.email, password: credentials.password })
    expect(loginRes.statusCode).toBe(200)

    const cookies = loginRes.headers["set-cookie"]
    const meRes = await request(app).get("/api/v1/auth/me").set("Cookie", cookies)
    expect(meRes.statusCode).toBe(200)
    expect(meRes.body.user.email).toBe(credentials.email)
  })

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send(credentials)
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credentials.email, password: "wrongpassword" })
    expect(res.statusCode).toBe(401)
  })

  it("issues a new access token via /refresh using the refresh cookie", async () => {
    const registerRes = await request(app).post("/api/v1/auth/register").send(credentials)
    const cookies = registerRes.headers["set-cookie"]

    const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookies)
    expect(refreshRes.statusCode).toBe(200)
    expect(refreshRes.headers["set-cookie"].some(c => c.startsWith("accessToken="))).toBe(true)
  })

  it("revokes the session on logout so the old refresh token stops working", async () => {
    const registerRes = await request(app).post("/api/v1/auth/register").send(credentials)
    const cookies = registerRes.headers["set-cookie"]

    await request(app).post("/api/v1/auth/logout").set("Cookie", cookies)

    const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookies)
    expect(refreshRes.statusCode).toBe(401)
  })
})
