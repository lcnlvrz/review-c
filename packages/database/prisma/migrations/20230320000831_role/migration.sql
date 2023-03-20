/*
  Warnings:

  - You are about to drop the column `Role` on the `Guest` table. All the data in the column will be lost.
  - Added the required column `role` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Guest` DROP COLUMN `Role`,
    ADD COLUMN `role` ENUM('OWNER', 'MEMBER') NOT NULL;
