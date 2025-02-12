/*
  Warnings:

  - A unique constraint covering the columns `[arrival]` on the table `Train` will be added. If there are existing duplicate values, this will fail.
  - Made the column `arrival` on table `train` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Train_departure_key` ON `train`;

-- AlterTable
ALTER TABLE `train` MODIFY `arrival` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Train_arrival_key` ON `Train`(`arrival`);
