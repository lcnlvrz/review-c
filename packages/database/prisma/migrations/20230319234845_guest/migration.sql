-- CreateTable
CREATE TABLE `Guest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `Role` ENUM('OWNER', 'MEMBER') NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,

    INDEX `Guest_workspaceId_idx`(`workspaceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
