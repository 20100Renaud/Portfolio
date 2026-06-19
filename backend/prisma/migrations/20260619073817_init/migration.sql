-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "Type_Depo" AS ENUM ('OFFER', 'REQUEST', 'QUESTION');

-- CreateTable
CREATE TABLE "T_Users" (
    "ID_User" TEXT NOT NULL,
    "Role_User" TEXT NOT NULL DEFAULT 'CLIENT',
    "Login_User" TEXT NOT NULL,
    "Email_User" TEXT NOT NULL,
    "Password_User" TEXT NOT NULL,
    "Date_User" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "City_User" TEXT NOT NULL,
    "Latitude_User" DOUBLE PRECISION NOT NULL,
    "Longitude_User" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "T_Users_pkey" PRIMARY KEY ("ID_User")
);

-- CreateTable
CREATE TABLE "T_Depos" (
    "ID_Depo" TEXT NOT NULL,
    "ID_User" TEXT NOT NULL,
    "Type_Depo" TEXT NOT NULL DEFAULT 'OFFER',
    "Cat_Depo" TEXT NOT NULL DEFAULT 'Undefined',
    "Title_Depo" TEXT NOT NULL,
    "Text_Depo" TEXT NOT NULL,
    "Date_Depo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Lifetime_Depo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "T_Depos_pkey" PRIMARY KEY ("ID_Depo")
);

-- CreateTable
CREATE TABLE "T_Answers" (
    "ID_Answer" TEXT NOT NULL,
    "ID_Depo" TEXT NOT NULL,
    "ID_User" TEXT NOT NULL,
    "Text_Answer" TEXT NOT NULL,
    "Date_Answer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "T_Answers_pkey" PRIMARY KEY ("ID_Answer")
);

-- CreateTable
CREATE TABLE "T_Images" (
    "ID_Image" TEXT NOT NULL,
    "ID_Depo" TEXT NOT NULL,
    "URL_Image" TEXT NOT NULL,
    "Text_Image" TEXT,
    "Date_Image" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "T_Images_pkey" PRIMARY KEY ("ID_Image")
);

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Login_User_key" ON "T_Users"("Login_User");

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Email_User_key" ON "T_Users"("Email_User");

-- AddForeignKey
ALTER TABLE "T_Depos" ADD CONSTRAINT "T_Depos_ID_User_fkey" FOREIGN KEY ("ID_User") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_User_fkey" FOREIGN KEY ("ID_User") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_Depo_fkey" FOREIGN KEY ("ID_Depo") REFERENCES "T_Depos"("ID_Depo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Images" ADD CONSTRAINT "T_Images_ID_Depo_fkey" FOREIGN KEY ("ID_Depo") REFERENCES "T_Depos"("ID_Depo") ON DELETE RESTRICT ON UPDATE CASCADE;
