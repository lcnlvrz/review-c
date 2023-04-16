/*
  Warnings:

  - You are about to drop the column `artifactId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Artifact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Review_artifactId_idx` ON `Review`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `artifactId`,
    ADD COLUMN `fileId` INTEGER NULL;

-- DropTable
DROP TABLE `Artifact`;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storedKey` VARCHAR(191) NOT NULL,
    `originalFilename` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Review_fileId_idx` ON `Review`(`fileId`);
