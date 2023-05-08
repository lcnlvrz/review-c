/*
  Warnings:

  - Added the required column `reviewId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thread` ADD COLUMN `reviewId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Thread_reviewId_idx` ON `Thread`(`reviewId`);
