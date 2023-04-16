/*
  Warnings:

  - The values [OWNER] on the enum `Member_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [OWNER] on the enum `Member_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `role` ENUM('ADMIN', 'MEMBER') NOT NULL;

-- AlterTable
ALTER TABLE `Member` MODIFY `role` ENUM('ADMIN', 'MEMBER') NOT NULL;

-- CreateTable
CREATE TABLE `Artifact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storedKey` VARCHAR(191) NOT NULL,
    `originalFilename` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `role` ENUM('OWNER', 'REVIEWER', 'VIEWER') NOT NULL,
    `inviteToken` VARCHAR(191) NULL,
    `inviteEmail` VARCHAR(191) NULL,
    `reviewId` VARCHAR(191) NULL,

    INDEX `ReviewUser_userId_idx`(`userId`),
    INDEX `ReviewUser_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('FILE', 'URL') NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `artifactId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Review_artifactId_idx`(`artifactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
