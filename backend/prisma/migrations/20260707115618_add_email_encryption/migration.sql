-- DropForeignKey
ALTER TABLE "T_Images" DROP CONSTRAINT "T_Images_ID_Depo_fkey";

-- DropIndex
DROP INDEX "T_Users_Email_User_key";

-- AlterTable
ALTER TABLE "T_Images" ALTER COLUMN "Date_Image" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "T_Users" DROP COLUMN "Email_User",
ADD COLUMN     "Email_Encrypted_User" TEXT NOT NULL,
ADD COLUMN     "Email_Hash_User" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "T_Users_Email_Hash_User_key" ON "T_Users"("Email_Hash_User");

-- AddForeignKey
ALTER TABLE "T_Images" ADD CONSTRAINT "T_Images_ID_Depo_fkey" FOREIGN KEY ("ID_Depo") REFERENCES "T_Depos"("ID_Depo") ON DELETE CASCADE ON UPDATE CASCADE;
