/*
  Warnings:

  - You are about to drop the column `Phone` on the `passenger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `passenger` DROP COLUMN `Phone`,
    ADD COLUMN `Phonenumber` VARCHAR(191) NOT NULL DEFAULT '9999999999';
