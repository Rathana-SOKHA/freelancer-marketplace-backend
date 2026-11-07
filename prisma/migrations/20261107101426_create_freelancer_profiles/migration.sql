-- CreateTable
CREATE TABLE `freelancer_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(150) NULL,
    `overview` TEXT NULL,
    `hourly_rate` DECIMAL(10, 2) NULL,
    `experience_level` ENUM('ENTRY', 'INTERMEDIATE', 'EXPERT') NULL,
    `location` VARCHAR(150) NULL,
    `portfolio_url` VARCHAR(500) NULL,
    `availability` ENUM('AVAILABLE', 'BUSY', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `freelancer_profiles_user_id_key`(`user_id`),
    INDEX `freelancer_profiles_experience_level_idx`(`experience_level`),
    INDEX `freelancer_profiles_availability_idx`(`availability`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `freelancer_profiles` ADD CONSTRAINT `freelancer_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
