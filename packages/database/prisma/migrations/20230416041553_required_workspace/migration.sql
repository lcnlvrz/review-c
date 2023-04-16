/*
  Warnings:

  - Made the column `workspaceId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Review` MODIFY `workspaceId` VARCHAR(191) NOT NULL;
