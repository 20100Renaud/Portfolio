-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateTable
CREATE TABLE "T_Clients" (
    "ID_Client" TEXT NOT NULL,
    "Login_Client" TEXT NOT NULL,
    "Mail_Client" TEXT NOT NULL,
    "Password_Client" TEXT NOT NULL,
    "Ville_Client" TEXT,
    "Latitude_Client" DOUBLE PRECISION,
    "Longitude_Client" DOUBLE PRECISION,
    "Date_Client" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Role_Client" TEXT NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "T_Clients_pkey" PRIMARY KEY ("ID_Client")
);

-- CreateTable
CREATE TABLE "T_Ads" (
    "ID_Ad" TEXT NOT NULL,
    "Title_Ad" TEXT NOT NULL,
    "Text_Ad" TEXT NOT NULL,
    "Date_Ad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Client_Ad" TEXT NOT NULL,

    CONSTRAINT "T_Ads_pkey" PRIMARY KEY ("ID_Ad")
);

-- CreateTable
CREATE TABLE "T_Answers" (
    "ID_Answer" TEXT NOT NULL,
    "Text_Answer" TEXT NOT NULL,
    "Date_Answer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Ad_Ans" TEXT NOT NULL,
    "ID_Client_Ans" TEXT NOT NULL,

    CONSTRAINT "T_Answers_pkey" PRIMARY KEY ("ID_Answer")
);

-- CreateIndex
CREATE UNIQUE INDEX "T_Clients_Login_Client_key" ON "T_Clients"("Login_Client");

-- CreateIndex
CREATE UNIQUE INDEX "T_Clients_Mail_Client_key" ON "T_Clients"("Mail_Client");

-- AddForeignKey
ALTER TABLE "T_Ads" ADD CONSTRAINT "T_Ads_ID_Client_Ad_fkey" FOREIGN KEY ("ID_Client_Ad") REFERENCES "T_Clients"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_Client_Ans_fkey" FOREIGN KEY ("ID_Client_Ans") REFERENCES "T_Clients"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Answers" ADD CONSTRAINT "T_Answers_ID_Ad_Ans_fkey" FOREIGN KEY ("ID_Ad_Ans") REFERENCES "T_Ads"("ID_Ad") ON DELETE RESTRICT ON UPDATE CASCADE;
