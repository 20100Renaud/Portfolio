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

  await prisma.T_Clients.upsert({
    where: { Mail_Client: unknownEmail },
    update: {},
    create: {
      Login_Client: "Unknown",
      Mail_Client: unknownEmail,
      Password_Client: "DISABLED",
      Role_Client: "CLIENT",
      PC_Client: "00000"
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
        PC_Client: "00000"
      },
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists (password NOT modified)");
  }

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
