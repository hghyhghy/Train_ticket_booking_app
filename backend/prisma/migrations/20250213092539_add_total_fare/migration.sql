/*
  Warnings:

  - Made the column `totalFare` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `totalFare` INTEGER NOT NULL DEFAULT 600;
