/*
  Warnings:

  - The primary key for the `Workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nanoid` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL,
    MODIFY `workspaceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Member` MODIFY `workspaceId` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL;

-- AlterTable
ALTER TABLE `Workspace` DROP PRIMARY KEY,
    DROP COLUMN `nanoid`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
