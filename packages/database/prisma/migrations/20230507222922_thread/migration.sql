-- AlterTable
ALTER TABLE `File` ADD COLUMN `messageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sentById` INTEGER NOT NULL,

    INDEX `Message_sentById_idx`(`sentById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessagesOnThreads` (
    `messageId` INTEGER NOT NULL,
    `threadId` INTEGER NOT NULL,

    INDEX `MessagesOnThreads_messageId_idx`(`messageId`),
    INDEX `MessagesOnThreads_threadId_idx`(`threadId`),
    PRIMARY KEY (`messageId`, `threadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thread` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `File_messageId_idx` ON `File`(`messageId`);
