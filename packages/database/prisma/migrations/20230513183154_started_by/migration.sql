/*
  Warnings:

  - Added the required column `startedById` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thread` ADD COLUMN `startedById` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Thread_startedById_idx` ON `Thread`(`startedById`);
