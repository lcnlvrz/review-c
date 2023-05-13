/*
  Warnings:

  - Added the required column `browser` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowHeight` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowWidth` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Point` ADD COLUMN `browser` VARCHAR(191) NOT NULL,
    ADD COLUMN `os` VARCHAR(191) NOT NULL,
    ADD COLUMN `windowHeight` INTEGER NOT NULL,
    ADD COLUMN `windowWidth` INTEGER NOT NULL;
