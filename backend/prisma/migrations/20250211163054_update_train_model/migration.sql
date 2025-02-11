-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Train` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trainNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `departure` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Train_trainNumber_key`(`trainNumber`),
    UNIQUE INDEX `Train_departure_key`(`departure`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
