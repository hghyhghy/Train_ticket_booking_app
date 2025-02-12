/*
  Warnings:

  - A unique constraint covering the columns `[trainId,type]` on the table `TrainClass` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `trainclass` DROP FOREIGN KEY `TrainClass_trainId_fkey`;

-- DropIndex
DROP INDEX `TrainClass_trainId_fkey` ON `trainclass`;

-- AlterTable
ALTER TABLE `trainclass` MODIFY `price` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TrainClass_trainId_type_key` ON `TrainClass`(`trainId`, `type`);

-- AddForeignKey
ALTER TABLE `TrainClass` ADD CONSTRAINT `TrainClass_trainId_fkey` FOREIGN KEY (`trainId`) REFERENCES `Train`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
