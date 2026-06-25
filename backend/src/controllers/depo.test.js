import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Flow of a Depository", () => {
    afterAll(async () => {
        await prisma.t_Depos.deleteMany({
            where: {
                OR: [
                    {
                        Title_Depo: {
                            startsWith: "test_"
                        },
                    },
                    {
                        Title_Depo: {
                            startsWith: "Updated_"
                        },
                    },
                ],
            },
        });
        await prisma.t_Users.deleteMany({
            where: {
                Login_User: "Test"
            }
        })
        await prisma.$disconnect();
    });

    test("Create -> Read -> Update -> Delete a Depository", async () => {
        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email: "test@gmail.com",
                password: "DISABLED",
                city_user: "Unknown",
                latitude_user: 0,
                longitude_user: 0,
            });
            expect(registerResponse.status).toBe(201);

        // Log unknow User
        const loginResponse = await request(app)
            .post("/api/auth/connect")
            .send({
                email: "test@gmail.com",
                password: "DISABLED"
            });

        expect(loginResponse.status).toBe(200);

        const cookie = loginResponse.headers["set-cookie"];

        // CREATE
        const response = await request(app)
            .post("/api/depos/")
            .set("Cookie", cookie)
            .send({
                title: "test_depo",
                description: "This is a test Depo"
            });

            expect(response.status).toBe(201);
            expect(response.body.Title_Depo).toBe("test_depo");
    })
})
