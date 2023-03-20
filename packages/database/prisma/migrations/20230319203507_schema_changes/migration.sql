/*
  Warnings:

  - Added the required column `provider` to the `IdentityProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `IdentityProvider` DROP FOREIGN KEY `IdentityProvider_userId_fkey`;

-- AlterTable
ALTER TABLE `IdentityProvider` ADD COLUMN `provider` ENUM('GOOGLE', 'FACEBOOK', 'GITHUB') NOT NULL;

-- RenameIndex
ALTER TABLE `IdentityProvider` RENAME INDEX `IdentityProvider_userId_fkey` TO `IdentityProvider_userId_idx`;
