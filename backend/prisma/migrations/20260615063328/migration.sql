-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "Type_Depo" AS ENUM ('Depo', 'Question');

-- CreateTable
CREATE TABLE "T_Users" (
    "ID_User" TEXT NOT NULL,
    "Login_User" TEXT NOT NULL,
    "Mail_User" TEXT NOT NULL,
    "Password_User" TEXT NOT NULL,
    "Ville_User" TEXT,
    "Latitude_User" DOUBLE PRECISION,
    "Longitude_User" DOUBLE PRECISION,
    "Date_User" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Role_User" TEXT NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "T_Users_pkey" PRIMARY KEY ("ID_User")
);

-- CreateTable
CREATE TABLE "T_Depos" (
    "ID_Depo" TEXT NOT NULL,
    "Type_Depo" TEXT NOT NULL DEFAULT 'Depo',
    "Title_Depo" TEXT NOT NULL,
    "Text_Depo" TEXT NOT NULL,
    "Date_Depo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_User_Depo" TEXT NOT NULL,

    CONSTRAINT "T_Depos_pkey" PRIMARY KEY ("ID_Depo")
);

-- CreateTable
CREATE TABLE "T_Answers" (
    "ID_Answer" TEXT NOT NULL,
    "Text_Answer" TEXT NOT NULL,
    "Date_Answer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Depo_Ans" TEXT NOT NULL,
    "ID_User_Ans" TEXT NOT NULL,

    CONSTRAINT "T_Answers_pkey" PRIMARY KEY ("ID_Answer")
);

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Login_User_key" ON "T_Users"("Login_User");

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Mail_User_key" ON "T_Users"("Mail_User");

-- AddForeignKey
ALTER TABLE "T_Depos" ADD CONSTRAINT "T_Depos_ID_User_Depo_fkey" FOREIGN KEY ("ID_User_Depo") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_User_Ans_fkey" FOREIGN KEY ("ID_User_Ans") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_Depo_Ans_fkey" FOREIGN KEY ("ID_Depo_Ans") REFERENCES "T_Depos"("ID_Depo") ON DELETE RESTRICT ON UPDATE CASCADE;
