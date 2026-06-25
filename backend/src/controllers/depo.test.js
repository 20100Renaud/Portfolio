import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Flow of a Depository", () => {
    // DELETE all the depos and user created
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
        // CREATE a test user
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

        // Log with the test user
        const loginResponse = await request(app)
            .post("/api/auth/connect")
            .send({
                email: "test@gmail.com",
                password: "DISABLED"
            });

        expect(loginResponse.status).toBe(200);

        const cookie = loginResponse.headers["set-cookie"];

        // CREATE a Depository
        const CreateResponse1 = await request(app)
            .post("/api/depos/")
            .set("Cookie", cookie)
            .send({
                title: "test_depo_1",
                description: "This is a test Depo"
            });

            expect(CreateResponse1.status).toBe(201);
            expect(CreateResponse1.body.Title_Depo).toBe("test_depo_1");

            const ID_Depo = CreateResponse1.body.ID_Depo;

        const CreateResponse2 = await request(app)
            .post("/api/depos/")
            .set("Cookie", cookie)
            .send({
                title: "test_depo_2",
                description: "This is a second test Depo"
            });

            expect(CreateResponse2.status).toBe(201);
            expect(CreateResponse2.body.Title_Depo).toBe("test_depo_2");

        //LIST all the depos
        const GetResponse = await request(app)
            .get("/api/depos/")

            expect(GetResponse.status).toBe(200);

        //UPDATE one depo
        const UpdateResponse = await request(app)
            .put(`/api/depos/${ID_Depo}`)
            .set("Cookie", cookie)
            .send({
                title: "test_depo_3",
                description: "This is a new description"
            })

        expect(UpdateResponse.body.Title_Depo).toBe("test_depo_3");
        expect(UpdateResponse.body.Text_Depo).toBe("This is a new description");

        //DELETE a depo
        const DeleteResponse = await request(app)
            .delete(`/api/depos/${ID_Depo}`)
            .set("Cookie", cookie)

        expect(DeleteResponse.status).toBe(200);
    })
})
