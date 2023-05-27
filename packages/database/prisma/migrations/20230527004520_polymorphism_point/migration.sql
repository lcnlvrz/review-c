/*
  Warnings:

  - You are about to drop the column `xPath` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `xPercentage` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `yPercentage` on the `Point` table. All the data in the column will be lost.
  - Added the required column `type` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Point` DROP COLUMN `xPath`,
    DROP COLUMN `xPercentage`,
    DROP COLUMN `yPercentage`,
    ADD COLUMN `markerId` INTEGER NULL,
    ADD COLUMN `selectionId` INTEGER NULL,
    ADD COLUMN `type` ENUM('Marker', 'Selection') NOT NULL;

-- CreateTable
CREATE TABLE `Selection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startContainerXPath` VARCHAR(191) NOT NULL,
    `startOffset` INTEGER NOT NULL,
    `endOffset` INTEGER NOT NULL,
    `endContainerXPath` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `xPath` VARCHAR(191) NOT NULL,
    `xPercentage` DOUBLE NOT NULL,
    `yPercentage` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Point_markerId_idx` ON `Point`(`markerId`);

-- CreateIndex
CREATE INDEX `Point_selectionId_idx` ON `Point`(`selectionId`);
