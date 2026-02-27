import request from "supertest"
import app from "../app.js"

describe("Health API", () => {
  it("should return system status", async () => {
    const res = await request(app).get("/health")
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe("OK")
  })
})