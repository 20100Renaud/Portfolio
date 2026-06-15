-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

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
CREATE TABLE "T_Ads" (
    "ID_Ad" TEXT NOT NULL,
    "Title_Ad" TEXT NOT NULL,
    "Text_Ad" TEXT NOT NULL,
    "Date_Ad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_User_Ad" TEXT NOT NULL,

    CONSTRAINT "T_Ads_pkey" PRIMARY KEY ("ID_Ad")
);

-- CreateTable
CREATE TABLE "T_Answers" (
    "ID_Answer" TEXT NOT NULL,
    "Text_Answer" TEXT NOT NULL,
    "Date_Answer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Ad_Ans" TEXT NOT NULL,
    "ID_User_Ans" TEXT NOT NULL,

    CONSTRAINT "T_Answers_pkey" PRIMARY KEY ("ID_Answer")
);

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Login_User_key" ON "T_Users"("Login_User");

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Mail_User_key" ON "T_Users"("Mail_User");

-- AddForeignKey
ALTER TABLE "T_Ads" ADD CONSTRAINT "T_Ads_ID_User_Ad_fkey" FOREIGN KEY ("ID_User_Ad") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_User_Ans_fkey" FOREIGN KEY ("ID_User_Ans") REFERENCES "T_Users"("ID_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_Ad_Ans_fkey" FOREIGN KEY ("ID_Ad_Ans") REFERENCES "T_Ads"("ID_Ad") ON DELETE RESTRICT ON UPDATE CASCADE;
