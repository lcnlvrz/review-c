/*
  Warnings:

  - You are about to drop the column `host` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `pathname` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thread` DROP COLUMN `host`,
    DROP COLUMN `path`,
    ADD COLUMN `pathname` VARCHAR(191) NOT NULL;
