import prisma from "../src/prismaClient.js";
import bcrypt from "bcrypt";
import { hmacEmail, encryptEmail, decryptEmail } from "../src/utils/emailCrypto.js";

async function main() {
  console.log("🌱 Creating demo data...");

  // ---------------- USERS ----------------

  const password = await bcrypt.hash("123456", 10);

  const AythanEmailHash = hmacEmail("aythan@sharup.fr");
  const AythanEmailEncrypted = encryptEmail("aythan@sharup.fr");

  const aythan = await prisma.T_Users.create({
    data: {
      Login_User: "Puma",
      Email_Encrypted_User: AythanEmailEncrypted,
      Email_Hash_User: AythanEmailHash,
      Password_User: password,
      Role_User: "CLIENT",
      City_User: "Sens",
      Latitude_User: 48.19603419481204,
      Longitude_User: 3.2870335570549027,
    },
  });

  const KikiEmailHash = hmacEmail("kiki@sharup.fr");
  const KikiEmailEncrypted = encryptEmail("kiki@sharup.fr");

  const kiki = await prisma.T_Users.create({
    data: {
      Login_User: "Kiki",
      Email_Encrypted_User: KikiEmailEncrypted,
      Email_Hash_User: KikiEmailHash,
      Password_User: password,
      Role_User: "CLIENT",
      City_User: "Saint-Sérotin",
      Latitude_User: 48.246025029569935,
      Longitude_User: 3.1577555967741935,
    },
  });

  const YoussefEmailHash = hmacEmail("youssef@sharup.fr");
  const YoussefEmailEncrypted = encryptEmail("youssef@sharup.fr");

  const youyou = await prisma.T_Users.create({
    data: {
      Login_User: "Le Bourrin",
      Email_Encrypted_User: YoussefEmailEncrypted,
      Email_Hash_User: YoussefEmailHash,
      Password_User: password,
      Role_User: "CLIENT",
      City_User: "Rosoy",
      Latitude_User: 48.149528074999985,
      Longitude_User: 3.3111308549999974,
    },
  });

  // ---------------- DEPOS ----------------

  const vegetables = await prisma.T_Depos.create({
    data: {
      ID_User: aythan.ID_User,
      Type_Depo: "OFFER",
      Cat_Depo: "Vegetables",
      Title_Depo: "Fresh tomatoes from my garden",
      Text_Depo: "I have extra tomatoes this week.",
      Lifetime_Depo: new Date("2026-08-01"),

      Images_Depos: {
        create: [
          {
            URL_Image: "/uploads/demo-tomatoes.jpg",
            Text_Image: "Fresh tomatoes",
          },
          {
            URL_Image: "/uploads/demo-garden.jpg",
            Text_Image: "My garden",
          },
        ],
      },
    },
  });

  const tools = await prisma.T_Depos.create({
    data: {
      ID_User: kiki.ID_User,
      Type_Depo: "REQUEST",
      Cat_Depo: "Tools",
      Title_Depo: "Looking for a drill",
      Text_Depo: "I need a drill for one afternoon to repair my shelf.",
      Lifetime_Depo: new Date("2026-09-12"),

      Images_Depos: {
        create: [
          {
            URL_Image: "/uploads/demo-drill.jpg",
            Text_Image: "Example drill",
          },
        ],
      },
    },
  });

  const plantQuestion = await prisma.T_Depos.create({
    data: {
      ID_User: youyou.ID_User,
      Type_Depo: "QUESTION",
      Cat_Depo: "Plants",
      Title_Depo: "How often should I water this plant?",
      Text_Depo: "I just bought this plant and I am not sure about watering.",
      Lifetime_Depo: new Date("2026-08-07"),

      Images_Depos: {
        create: [
          {
            URL_Image: "/uploads/demo-plant.jpg",
            Text_Image: "Unknown plant",
          },
        ],
      },
    },
  });

  // ---------------- ANSWERS ----------------

  await prisma.T_Answers.create({
    data: {
      ID_Depo: plantQuestion.ID_Depo,
      ID_User: aythan.ID_User,
      Text_Answer:
        "It looks like a tropical plant. Water when the soil starts drying.",
    },
  });

  await prisma.T_Answers.create({
    data: {
      ID_Depo: plantQuestion.ID_Depo,
      ID_User: kiki.ID_User,
      Text_Answer: "You can also put it near indirect sunlight.",
    },
  });

  await prisma.T_Answers.create({
    data: {
      ID_Depo: tools.ID_Depo,
      ID_User: youyou.ID_User,
      Text_Answer: "I have one available. You can borrow mine.",
    },
  });

  console.log("✅ Demo data created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
