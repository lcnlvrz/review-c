-- CreateTable
CREATE TABLE `FilesOnMessages` (
    `fileId` INTEGER NOT NULL,
    `messageId` INTEGER NOT NULL,

    INDEX `FilesOnMessages_fileId_idx`(`fileId`),
    INDEX `FilesOnMessages_messageId_idx`(`messageId`),
    PRIMARY KEY (`fileId`, `messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
