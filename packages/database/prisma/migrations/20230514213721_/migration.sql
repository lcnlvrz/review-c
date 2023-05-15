/*
  Warnings:

  - You are about to drop the column `url` on the `Review` table. All the data in the column will be lost.
  - The values [URL] on the enum `Review_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `host` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `url`,
    ADD COLUMN `website` VARCHAR(191) NULL,
    MODIFY `type` ENUM('FILE', 'WEBSITE') NOT NULL;

-- AlterTable
ALTER TABLE `Thread` ADD COLUMN `host` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD COLUMN `resolvedAt` DATETIME(3) NULL;
