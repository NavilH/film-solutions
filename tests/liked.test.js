const request = require("supertest");
const app = require("../server");

let token;
let userId;
let likedId;

const movie = {
  movie_id: 123,
  title: "Test Movie",
  poster_url: "https://image.tmdb.org/t/p/w500/test.jpg",
};

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ username: "likeduser", password: "password123" });

  token = res.body.token;
  userId = res.body.userId;
});

describe("POST /api/users/:user_id/liked", () => {
  test("rejects request without token", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/liked`)
      .send(movie);

    expect(res.status).toBe(401);
  });

  test("likes a movie and returns id", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/liked`)
      .set("Authorization", `Bearer ${token}`)
      .send(movie);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    likedId = res.body.id;
  });

  test("returns Already liked for duplicate", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/liked`)
      .set("Authorization", `Bearer ${token}`)
      .send(movie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Already liked");
  });
});

describe("GET /api/users/:user_id/liked", () => {
  test("rejects request without token", async () => {
    const res = await request(app).get(`/api/users/${userId}/liked`);

    expect(res.status).toBe(401);
  });

  test("returns liked movies", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/liked`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("DELETE /api/users/:user_id/liked/:liked_id", () => {
  test("rejects request without token", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/liked/${likedId}`);

    expect(res.status).toBe(401);
  });

  test("removes a liked movie", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/liked/${likedId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Removed from liked");
  });

  test("returns 404 for already removed movie", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/liked/${likedId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
