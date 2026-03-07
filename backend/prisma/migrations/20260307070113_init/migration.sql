-- CreateTable
CREATE TABLE "Client" (
    "ID_Client" TEXT NOT NULL,
    "Login_Client" TEXT NOT NULL,
    "Mail_Client" TEXT NOT NULL,
    "Password_Client" TEXT NOT NULL,
    "Date_Client" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("ID_Client")
);

-- CreateTable
CREATE TABLE "Post" (
    "ID_Post" TEXT NOT NULL,
    "Title_Post" TEXT NOT NULL,
    "Description_Post" TEXT NOT NULL,
    "Date_Post" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Client_Post" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("ID_Post")
);

-- CreateTable
CREATE TABLE "Comment" (
    "ID_Com" TEXT NOT NULL,
    "Description_Com" TEXT NOT NULL,
    "Date_Com" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ID_Post" TEXT NOT NULL,
    "ID_Client_Com" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("ID_Com")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_Login_Client_key" ON "Client"("Login_Client");

-- CreateIndex
CREATE UNIQUE INDEX "Client_Mail_Client_key" ON "Client"("Mail_Client");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ID_Client_Post_fkey" FOREIGN KEY ("ID_Client_Post") REFERENCES "Client"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ID_Post_fkey" FOREIGN KEY ("ID_Post") REFERENCES "Post"("ID_Post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ID_Client_Com_fkey" FOREIGN KEY ("ID_Client_Com") REFERENCES "Client"("ID_Client") ON DELETE RESTRICT ON UPDATE CASCADE;
