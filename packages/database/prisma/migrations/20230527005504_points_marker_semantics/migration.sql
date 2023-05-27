/*
  Warnings:

  - You are about to drop the column `xPath` on the `Marker` table. All the data in the column will be lost.
  - You are about to drop the column `xPercentage` on the `Marker` table. All the data in the column will be lost.
  - You are about to drop the column `yPercentage` on the `Marker` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `isMobile` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `markerId` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `selectionId` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `windowHeight` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `windowWidth` on the `Point` table. All the data in the column will be lost.
  - Added the required column `browser` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowHeight` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowWidth` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xPath` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xPercentage` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPercentage` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Point_createdById_idx` ON `Point`;

-- DropIndex
DROP INDEX `Point_markerId_idx` ON `Point`;

-- DropIndex
DROP INDEX `Point_selectionId_idx` ON `Point`;

-- AlterTable
ALTER TABLE `Marker` DROP COLUMN `xPath`,
    DROP COLUMN `xPercentage`,
    DROP COLUMN `yPercentage`,
    ADD COLUMN `browser` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `isMobile` BOOLEAN NULL,
    ADD COLUMN `os` VARCHAR(191) NOT NULL,
    ADD COLUMN `pointId` INTEGER NULL,
    ADD COLUMN `selectionId` INTEGER NULL,
    ADD COLUMN `type` ENUM('Point', 'Selection') NOT NULL,
    ADD COLUMN `windowHeight` INTEGER NOT NULL,
    ADD COLUMN `windowWidth` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Point` DROP COLUMN `browser`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `createdById`,
    DROP COLUMN `isMobile`,
    DROP COLUMN `markerId`,
    DROP COLUMN `os`,
    DROP COLUMN `selectionId`,
    DROP COLUMN `type`,
    DROP COLUMN `windowHeight`,
    DROP COLUMN `windowWidth`,
    ADD COLUMN `xPath` VARCHAR(191) NOT NULL,
    ADD COLUMN `xPercentage` DOUBLE NOT NULL,
    ADD COLUMN `yPercentage` DOUBLE NOT NULL;

-- CreateIndex
CREATE INDEX `Marker_createdById_idx` ON `Marker`(`createdById`);

-- CreateIndex
CREATE INDEX `Marker_pointId_idx` ON `Marker`(`pointId`);

-- CreateIndex
CREATE INDEX `Marker_selectionId_idx` ON `Marker`(`selectionId`);
