import prisma from "../src/prismaClient.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { hmacEmail, encryptEmail, decryptEmail } from "../src/utils/emailCrypto.js";

dotenv.config();

async function main() {
  // ------------------ UNKNOWN USER ------------------
  const unknownEmail = process.env.UNKNOWN_EMAIL;
  if (!unknownEmail) {
    throw new Error("UNKNOWN_EMAIL missing");
  }

  const UnknowEmailHash = hmacEmail(unknownEmail);
  const UnknowEmailEncrypted = encryptEmail(unknownEmail);

  const unknownUser = await prisma.T_Users.upsert({
    where: { Email_Hash_User: UnknowEmailHash },
    update: {},
    create: {
      Login_User: "Unknown",
      Email_Hash_User: UnknowEmailHash,
      Email_Encrypted_User: UnknowEmailEncrypted,
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

  const AdminEmailHash = hmacEmail(adminEmail);
  const AdminEmailEncrypted = encryptEmail(adminEmail);

  const existingAdmin = await prisma.T_Users.findUnique({
    where: { Email_Hash_User: AdminEmailHash },
  });
  if (!existingAdmin) {
    await prisma.T_Users.create({
      data: {
        Login_User: "Admin",
        Email_Hash_User: AdminEmailHash,
        Email_Encrypted_User: AdminEmailEncrypted,
        Password_User: await bcrypt.hash(adminPassword, 10),
        Role_User: "ADMIN",
        City_User: "Unknown",
        Latitude_User: 0.0,
        Longitude_User: 0.0,
      },
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists (password NOT modified)");
  }

  // ------------------ CREATE DEPO ------------------
  await prisma.T_Depos.upsert({
    where: {
      ID_Depo: "45g98ty32",
    },
    update: {},
    create: {
      ID_Depo: "45g98ty32",
      Cat_Depo: "Plants",
      Title_Depo: "Test Depo title",
      Text_Depo: "Text for the test depo.",
      ID_User: unknownUser.ID_User,
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
