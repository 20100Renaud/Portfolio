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

  const unknownUser = await prisma.T_Users.upsert({
    where: { Email_User: unknownEmail },
    update: {},
    create: {
      Login_User: "Unknown",
      Email_User: unknownEmail,
      Password_User: "DISABLED",
      Role_User: "CLIENT",
      City_User: "Unknown",
      Latitude_User: 0.0,
      Longitude_User: 0.0,
    },
  });

  console.log("Unknown user created");

  // ------------------ ADMIN USER ------------------
  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing");
  }

  const existingAdmin = await prisma.T_Users.findUnique({
    where: { Email_User: adminEmail },
  });
  if (!existingAdmin) {
    await prisma.T_Users.create({
      data: {
        Login_User: "Admin",
        Email_User: adminEmail,
        Password_User: await bcrypt.hash(adminPassword, 10),
        Role_User: "ADMIN",
        City_User: "Unknow",
        Latitude_User: 0.0,
        Longitude_User: 0.0,
      },
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists (password NOT modified)");
  }

  // ------------------ CREATE DEPOT ------------------
  await prisma.T_Depos.upsert({
    where: {
      ID_Depo: "UNKNOWN_DEPOT_ID",
    },
    update: {},
    create: {
      ID_Depo: "UNKNOWN_DEPOT_ID",
      Title_Depo: "Unknown Depo",
      Text_Depo: "This is a fallback Depo created by the system.",
      ID_User: unknownUser.ID_User, // important !
    },
  });
  // -------------------- VERIFY ---------------------
  const users = await prisma.T_Users.findMany({
    select: { Login_User: true, Role_User: true },
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
