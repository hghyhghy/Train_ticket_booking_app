/*
  Warnings:

  - You are about to drop the column `email` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `passenger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `passenger` DROP COLUMN `email`,
    DROP COLUMN `phone`,
    ADD COLUMN `coachPosition` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    ADD COLUMN `coachType` VARCHAR(191) NOT NULL DEFAULT 'General';
