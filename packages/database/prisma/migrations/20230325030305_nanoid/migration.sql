/*
  Warnings:

  - You are about to alter the column `workspaceId` on the `Invitation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `workspaceId` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Workspace` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `nanoid` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `workspaceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Member` MODIFY `workspaceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Workspace` DROP PRIMARY KEY,
    ADD COLUMN `nanoid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
