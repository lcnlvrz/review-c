/*
  Warnings:

  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Member` ADD COLUMN `invitationAcceptedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Guest`;

-- CreateTable
CREATE TABLE `Invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'MEMBER') NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,

    INDEX `Invitation_workspaceId_idx`(`workspaceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
