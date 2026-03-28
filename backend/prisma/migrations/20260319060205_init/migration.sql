-- CreateTable
CREATE TABLE "T_Clients" (
    "ID_Client" TEXT NOT NULL,
    "Login_Client" TEXT NOT NULL,
    "Mail_Client" TEXT NOT NULL,
    "Password_Client" TEXT NOT NULL,
    "PC_Client" TEXT NOT NULL,
    "Date_Client" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "T_Clients_pkey" PRIMARY KEY ("ID_Client")
);

-- CreateTable
CREATE TABLE "T_Posts" (
    "ID_Post" TEXT NOT NULL,
    "Title_Post" TEXT NOT NULL,
    "Description_Post" TEXT NOT NULL,
    "Date_Post" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Client_Post" TEXT NOT NULL,

    CONSTRAINT "T_Posts_pkey" PRIMARY KEY ("ID_Post")
);

-- CreateTable
CREATE TABLE "T_Comments" (
    "ID_Com" TEXT NOT NULL,
    "Description_Com" TEXT NOT NULL,
    "Date_Com" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Post_Com" TEXT NOT NULL,
    "ID_Client_Com" TEXT NOT NULL,

    CONSTRAINT "T_Comments_pkey" PRIMARY KEY ("ID_Com")
);

-- CreateIndex
CREATE UNIQUE INDEX "T_Clients_Login_Client_key" ON "T_Clients"("Login_Client");

-- CreateIndex
CREATE UNIQUE INDEX "T_Clients_Mail_Client_key" ON "T_Clients"("Mail_Client");

-- AddForeignKey
ALTER TABLE "T_Posts" ADD CONSTRAINT "T_Posts_ID_Client_Post_fkey" FOREIGN KEY ("ID_Client_Post") REFERENCES "T_Clients"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Comments" ADD CONSTRAINT "T_Comments_ID_Post_Com_fkey" FOREIGN KEY ("ID_Post_Com") REFERENCES "T_Posts"("ID_Post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_Comments" ADD CONSTRAINT "T_Comments_ID_Client_Com_fkey" FOREIGN KEY ("ID_Client_Com") REFERENCES "T_Clients"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;

--Add Unkown Client
INSERT INTO "T_Clients" 
("ID_Client", "Login_Client", "Mail_Client", "Mail_Hash_Client", "Password_Client", "Role_Client", "PC_Client")
VALUES 
('00000000-0000-0000-0000-000000000000', 'Unknown', 'un@known.com', 'unknownhash', '', 'CLIENT', '');