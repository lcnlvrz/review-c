-- AlterTable
ALTER TABLE `Point` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isMobile` BOOLEAN NULL;
