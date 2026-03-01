test("Create and fetch tasks flow", async () => {
  const createRes = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Integration Test Task" })

  expect(createRes.statusCode).toBe(201)

  const fetchRes = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${token}`)

  expect(fetchRes.body.length).toBe(1)
})