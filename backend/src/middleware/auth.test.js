import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Authentication flow", () => {
  const email = `test_${Date.now()}@gmail.com`;
  const password = "test1234";

  afterAll(async () => {
    await prisma.T_Users.deleteMany({
      where: {
        Email_User: {
          startsWith: "test_",
        },
      },
    });

    await prisma.$disconnect();
  });

  test("register -> login -> delete", async () => {
    // REGISTER
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Test",
        email,
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });

    expect(registerResponse.status).toBe(201);

    // LOGIN
    const loginResponse = await request(app)
      .post("/api/auth/connect")
      .send({
        email,
        password,
      });

    expect(loginResponse.status).toBe(200);

    const cookie = loginResponse.headers["set-cookie"];

    expect(cookie).toBeDefined();

    // DELETE
    const deleteResponse = await request(app)
      .delete("/api/auth/delete")
      .set("Cookie", cookie);

    expect(deleteResponse.status).toBe(200);
  });
});
