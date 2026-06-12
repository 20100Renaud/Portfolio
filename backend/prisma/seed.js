import prisma from "../src/prismaClient.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";


dotenv.config();

async function main() {
  // ------------------ UNKNOWN USER ------------------
  const unknownEmail = process.env.UNKNOWN_EMAIL;
  if (!unknownEmail) {
    throw new Error("UNKNOWN_EMAIL missing");
  }

  const unknownClient = await prisma.T_Clients.upsert({
    where: { Mail_Client: unknownEmail },
    update: {},
    create: {
      Login_Client: "Unknown",
      Mail_Client: unknownEmail,
      Password_Client: "DISABLED",
      Role_Client: "CLIENT",
      Ville_Client: "Unknown",
      Latitude_Client: 0.0,
      Longitude_Client: 0.0,
    },
  });

  console.log("Unknown user created");

  // ------------------ ADMIN USER ------------------
  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing");
  }

  const existingAdmin = await prisma.T_Clients.findUnique({
    where: { Mail_Client: adminEmail },
  });
  if (!existingAdmin) {
    await prisma.T_Clients.create({
      data: {
        Login_Client: "Admin",
        Mail_Client: adminEmail,
        Password_Client: await bcrypt.hash(adminPassword, 10),
        Role_Client: "ADMIN",
        Ville_Client: "Unknow",
        Latitude_Client: 0.0,
        Longitude_Client: 0.0,
      },
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists (password NOT modified)");
  }

  // ------------------ CREATE AD ------------------
  await prisma.T_Ads.upsert({
    where: {
      ID_Ad: "UNKNOWN_AD_ID",
    },
    update: {},
    create: {
      ID_Ad: "UNKNOWN_AD_ID",
      Title_Ad: "Unknown advertisement",
      Text_Ad: "This is a fallback ad created by the system.",
      ID_Client_Ad: unknownClient.ID_Client, // important !
    },
  });
  // -------------------- VERIFY ---------------------
  const users = await prisma.T_Clients.findMany({
    select: { Login_Client: true, Role_Client: true },
  });

  console.log("Users in DB:", users);
}

main()

  .then(() => {
    console.log("🌱 Seeding done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
