/*
  Warnings:

  - A unique constraint covering the columns `[departure,arrival]` on the table `Train` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `train` ADD COLUMN `arrival` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Train_departure_arrival_key` ON `Train`(`departure`, `arrival`);
