import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";
import { date } from "zod";

describe("Flow of a Depository", () => {
    // DELETE all the depos and user created
    afterAll(async () => {
        await prisma.t_Answers.deleteMany({
            where: {
                OR: [
                    {
                        Text_Answer: {
                            startsWith: "test"
                        },
                    },
                    {
                        Text_Answer: {
                            startsWith: "update"
                        },
                    },
                ],
            },
        });

        await prisma.t_Depos.deleteMany({
            where: {
                Title_Depo: "test_depo_1"
            }
        })

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

        //CREATE a depo
        const CreateDepo = await request(app)
            .post("/api/depos/")
            .set("Cookie", cookie)
            .send({
                type: "OFFER",
                cat: "Tomatoes",
                title: "test_depo_1",
                description: "This is a test Depo",
                lifetime: new Date(),
            });

        expect(CreateDepo.status).toBe(201);
        expect(CreateDepo.body.Title_Depo).toBe("test_depo_1");

        const ID_Depo = CreateDepo.body.ID_Depo;

        //Create an answer
        const CreateAnswer = await request(app)
            .post(`/api/depos/${ID_Depo}/answers`)
            .set("Cookie", cookie)
            .send({
                description: "test number one !"
            });

        expect(CreateAnswer.status).toBe(201)
        expect(CreateAnswer.body.Text_Answer).toBe("test number one !")

        const ID_Answer = CreateAnswer.body.ID_Answer

        //UPDATE an answer
        const UpdateAnswer = await request(app)
            .put(`/api/responses/answers/${ID_Answer}`)
            .set("Cookie", cookie)
            .send({
                description: "update 1"
            })

            expect(UpdateAnswer.status).toBe(200)
            expect(UpdateAnswer.body.Text_Answer).toBe("update 1")

        //DELETE an answer
        const DeleteAnswer = await request(app)
            .delete(`/api/responses/answers/${ID_Answer}`)
            .set("Cookie", cookie)

            expect(DeleteAnswer.status).toBe(200)
    });
});
