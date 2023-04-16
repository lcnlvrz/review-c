-- AlterTable
ALTER TABLE `Review` ADD COLUMN `workspaceId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Review_workspaceId_idx` ON `Review`(`workspaceId`);
