/*
  Warnings:

  - Added the required column `invitedById` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invitation` ADD COLUMN `invitedById` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Invitation_invitedById_idx` ON `Invitation`(`invitedById`);
