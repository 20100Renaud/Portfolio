import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";
import { hmacEmail, encryptEmail, decryptEmail } from "../utils/emailCrypto.js";

describe("Flow of a User  ", () => {
  const email = `test_${Date.now()}@gmail.com`;
  const password = "test1234";

  const unknownEmail = process.env.UNKNOWN_EMAIL;
  if (!unknownEmail) {
    throw new Error("UNKNOWN_EMAIL missing");
  }

  const UnknowEmailHash = hmacEmail(unknownEmail);
  const UnknowEmailEncrypted = encryptEmail(unknownEmail);

  //CREATE the unknow user
  beforeAll(async () => {

    await prisma.T_Users.create({
      data: {
        Login_User: "unknow",
        Email_Hash_User: UnknowEmailHash,
        Email_Encrypted_User: UnknowEmailEncrypted,
        Password_User: "DISABLE",
        City_User: "unknow",
        Latitude_User: 0,
        Longitude_User: 0,
      },
    });
  });

  // DELETE all the users created
  afterAll(async () => {
    await prisma.t_Users.deleteMany({
      where: {
        OR: [
          {
            Login_User: {
              startsWith: "test_",
            },
          },
          {
            Login_User: {
              startsWith: "NewUsername",
            },
          },
          {
            Login_User: {
              startsWith: "unknow",
            },
          },
        ],
      },
    });

    await prisma.$disconnect();
  });

  test("register -> login -> update user", async () => {
    // REGISTER
    const RegisterResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: "test_1",
        email,
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });

      expect(RegisterResponse.status).toBe(201)

      //Email already used
      const EmailusedResponse = await request(app)
      .post(`/api/auth/register`)
      .send({
        username: "Test",
        email,
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });
      expect(EmailusedResponse.status).toBe(409)

      //Username too long
      const UsernameLongResponse = await request(app)
      .post(`/api/auth/register`)
      .send({
        username: "1234567890123456789012345",
        email: "test_@g.com",
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });
      expect(UsernameLongResponse.status).toBe(400)

      // Bad Register
      const BadRegisterResponse = await request(app)
      .post(`/api/auth/register`)
      .send({
        username: "Test",
        email: "enzogmail.com",
        password,
        city_user: "Unknown",
        latitude_user: 0,
        longitude_user: 0,
      });
      expect(BadRegisterResponse.status).toBe(400)

    //Bad Login (invalid Credentials or user not found)
    //We put the same error for the two so that other can't know if it exists or no
    const FalseLoginResponse = await request(app)
      .post("/api/auth/connect")
      .send({
        email,
        password: "DISABLED",
      });
    expect(FalseLoginResponse.status).toBe(400)

    // LOGIN
    const loginResponse = await request(app)
      .post("/api/auth/connect")
      .send({
        email,
        password,
      });

    const cookie = loginResponse.headers["set-cookie"];

    //email already used if updated
    const BadUpdateResponse = await request(app)
      .put("/api/auth/update")
      .set("Cookie", cookie)
      .send({
        username: "NewUsername",
        email,
      });
      expect(BadUpdateResponse.status).toBe(409)

    // BAD UPDATE
    const response = await request(app)
      .put("/api/auth/update")
      .send({
        username: "Hack",
        email: "hack@gmail.com",
      });

    expect(response.status).toBe(401);

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

    //UPDATE Password
    const PasswordResponse = await request(app)
      .put("/api/auth/changePassword")
      .set("Cookie", cookie)
      .send({
        oldPassword: password,
        newPassword: "test1212",
        confirmPassword: "test1212",
      });

      expect(PasswordResponse.status).toBe(200);

      // DELETE 
      const deleteResponse = await request(app) 
      .delete("/api/auth/delete") 
      .set("Cookie", cookie); 
      expect(deleteResponse.status).toBe(200);
  });
});
