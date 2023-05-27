/*
  Warnings:

  - Added the required column `endChildrenNodeIndex` to the `Selection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startChildrenNodeIndex` to the `Selection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Selection` ADD COLUMN `endChildrenNodeIndex` INTEGER NOT NULL,
    ADD COLUMN `startChildrenNodeIndex` INTEGER NOT NULL;
