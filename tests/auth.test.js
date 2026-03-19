const request = require("supertest");
const app = require("../server");

describe("POST /api/auth/register", () => {
  test("registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.username).toBe("testuser");
  });

  test("rejects duplicate username", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "dupeuser", password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "dupeuser", password: "password123" });

    expect(res.status).toBe(409);
  });

  test("rejects missing password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser2" });

    expect(res.status).toBe(400);
  });

  test("rejects password shorter than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser3", password: "123" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "loginuser", password: "password123" });
  });

  test("logs in with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "loginuser", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.username).toBe("loginuser");
  });

  test("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "loginuser", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  test("rejects non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "password123" });

    expect(res.status).toBe(401);
  });

  test("rejects missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "loginuser" });

    expect(res.status).toBe(400);
  });
});
