-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `designation` VARCHAR(30) NOT NULL,
    `marque` VARCHAR(20) NOT NULL,
    `reference` VARCHAR(30) NOT NULL,
    `qtestock` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `imageart` VARCHAR(100) NOT NULL,
    `scategorieID` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `articles_scategorieid_foreign`(`scategorieID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nomcategorie` VARCHAR(30) NOT NULL,
    `imagecategorie` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `categories_nomcategorie_unique`(`nomcategorie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scategories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nomscategorie` VARCHAR(100) NOT NULL,
    `imagescategorie` VARCHAR(100) NOT NULL,
    `categorieID` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `scategories_categorieid_foreign`(`categorieID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_scategorieid_foreign` FOREIGN KEY (`scategorieID`) REFERENCES `scategories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scategories` ADD CONSTRAINT `scategories_categorieid_foreign` FOREIGN KEY (`categorieID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
