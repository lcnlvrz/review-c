/*
  Warnings:

  - Added the required column `xPath` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xPercentage` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPercentage` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thread` ADD COLUMN `xPath` VARCHAR(191) NOT NULL,
    ADD COLUMN `xPercentage` DOUBLE NOT NULL,
    ADD COLUMN `yPercentage` DOUBLE NOT NULL;
