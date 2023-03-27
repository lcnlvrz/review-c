/*
  Warnings:

  - The primary key for the `Invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `Invitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,workspaceId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Invitation` DROP PRIMARY KEY,
    DROP COLUMN `token`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_email_workspaceId_key` ON `Invitation`(`email`, `workspaceId`);
