/*
  Warnings:

  - You are about to alter the column `created_at` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `created_at` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `created_at` on the `scategories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `scategories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `articles` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `categories` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `scategories` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_scategorieid_foreign` FOREIGN KEY (`scategorieID`) REFERENCES `scategories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scategories` ADD CONSTRAINT `scategories_categorieid_foreign` FOREIGN KEY (`categorieID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
