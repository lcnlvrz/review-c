/*
  Warnings:

  - The values [Point,Selection] on the enum `Marker_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Marker` MODIFY `type` ENUM('point', 'selection') NOT NULL;
