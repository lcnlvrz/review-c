/*
  Warnings:

  - You are about to drop the column `xPath` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `xPercentage` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `yPercentage` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `pointId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thread` DROP COLUMN `xPath`,
    DROP COLUMN `xPercentage`,
    DROP COLUMN `yPercentage`,
    ADD COLUMN `pointId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdById` INTEGER NOT NULL,
    `xPath` VARCHAR(191) NOT NULL,
    `xPercentage` DOUBLE NOT NULL,
    `yPercentage` DOUBLE NOT NULL,

    INDEX `Point_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Thread_pointId_idx` ON `Thread`(`pointId`);
