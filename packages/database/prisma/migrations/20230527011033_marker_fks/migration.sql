/*
  Warnings:

  - You are about to drop the column `pointId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `markerId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Thread_pointId_idx` ON `Thread`;

-- AlterTable
ALTER TABLE `Thread` DROP COLUMN `pointId`,
    ADD COLUMN `markerId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Thread_markerId_idx` ON `Thread`(`markerId`);
