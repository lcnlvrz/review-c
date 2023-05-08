/*
  Warnings:

  - You are about to drop the column `messageId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `FilesOnMessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessagesOnThreads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `File_messageId_idx` ON `File`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `messageId`;

-- DropTable
DROP TABLE `FilesOnMessages`;

-- DropTable
DROP TABLE `MessagesOnThreads`;

-- CreateTable
CREATE TABLE `_FileToMessage` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FileToMessage_AB_unique`(`A`, `B`),
    INDEX `_FileToMessage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MessageToThread` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MessageToThread_AB_unique`(`A`, `B`),
    INDEX `_MessageToThread_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
