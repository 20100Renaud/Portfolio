import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Update user", () => {
  const email = `test_${Date.now()}@gmail.com`;
  const password = "test1234";

  afterAll(async () => {
    await prisma.t_Users.deleteMany({
      where: {
        OR: [
          {
            Email_User: {
              startsWith: "test_",
            },
          },
          {
            Email_User: {
              startsWith: "updated_",
            },
          },
        ],
      },
    });

    await prisma.$disconnect();
  });

  test("register -> login -> update user", async () => {
    // REGISTER
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "Test",
        email,
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });

    // LOGIN
    const loginResponse = await request(app)
      .post("/api/auth/connect")
      .send({
        email,
        password,
      });

    const cookie = loginResponse.headers["set-cookie"];

    // UPDATE
    const updateResponse = await request(app)
      .put("/api/auth/update")
      .set("Cookie", cookie)
      .send({
        username: "NewUsername",
        email: `updated_${Date.now()}@gmail.com`,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.Login_User).toBe("NewUsername");
    expect(updateResponse.body.Email_User).toContain("updated_");

      // DELETE 
      const deleteResponse = await request(app) 
      .delete("/api/auth/delete") 
      .set("Cookie", cookie); 
      expect(deleteResponse.status).toBe(200);
    
  });
});
