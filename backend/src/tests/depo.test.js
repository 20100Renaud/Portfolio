import { jest } from "@jest/globals";
import path from "path";
import request from "supertest";
import prisma from "../prismaClient.js";

jest.unstable_mockModule("../../services/cloudinary.service.js", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    secure_url: "https://fake.cloudinary.com/test-image.jpg",
  }),
}));

const { default: app } = await import("../app.js");

describe("Flow of a Depository", () => {
    // DELETE all the depos and user created
    beforeAll(async () => {
    await prisma.t_Images.deleteMany();
    await prisma.t_Depos.deleteMany();
    await prisma.t_Users.deleteMany();
    });
 
    afterAll(async () => {
    await prisma.t_Images.deleteMany();
    await prisma.t_Answers.deleteMany();
    await prisma.t_Depos.deleteMany();
    await prisma.t_Users.deleteMany();
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

        // CREATE two Depositories, with one with Image
        const CreateResponse1 = await request(app)
            .post("/api/depos/")
            .set("Cookie", cookie)
            .send({
                type: "OFFER",
                cat: "Vegetable",
                title: "test_depo_1",
                description: "This is a test Depo",
                lifetime: new Date(),
            });

            expect(CreateResponse1.status).toBe(201);
            expect(CreateResponse1.body.Title_Depo).toBe("test_depo_1");

            const ID_Depo = CreateResponse1.body.ID_Depo;
        
        const CreateRepoImageresponse = await request(app)
            .post("/api/depos")
            .set("Cookie", cookie)
            .field("type", "REQUEST")
            .field("cat", "Potatoes")
            .field("title", "test_depo_image")
            .field("description", "Depo with image")
            .field("lifetime", '2026-06-30T08:23:42.486Z')
            .attach(
                "images",
                path.join(process.cwd(), "src/tests/assets/test-image.jpg")
            );

        expect(CreateRepoImageresponse.status).toBe(201);
        expect(CreateRepoImageresponse.body.Title_Depo).toBe("test_depo_image");

        const depoId = CreateRepoImageresponse.body.ID_Depo;
        const images = await prisma.t_Images.findMany({
            where: {
                ID_Depo: depoId,
            },
        });

        expect(images).toHaveLength(1);
        expect(images[0].URL_Image).toContain("cloudinary");

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
