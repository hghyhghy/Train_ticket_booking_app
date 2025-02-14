-- AlterTable
ALTER TABLE `passenger` ADD COLUMN `Food` VARCHAR(191) NOT NULL DEFAULT 'Non veg',
    ADD COLUMN `Nationality` VARCHAR(191) NOT NULL DEFAULT 'Indian';
