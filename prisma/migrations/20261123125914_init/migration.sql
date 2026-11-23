-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(500) NULL,
    `phone` VARCHAR(30) NULL,
    `password_hash` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `roles_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role_id` CHAR(36) NOT NULL,
    `assigned_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_roles_role_id_idx`(`role_id`),
    UNIQUE INDEX `user_roles_user_id_role_id_key`(`user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(100) NULL,
    `scope` TEXT NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(255) NULL,

    INDEX `accounts_user_id_idx`(`user_id`),
    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` CHAR(36) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    INDEX `sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    PRIMARY KEY (`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pillars` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pillars_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` CHAR(36) NOT NULL,
    `pillar_id` CHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `short_description` VARCHAR(500) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `target_amount` BIGINT NOT NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'PAUSED', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `cover_image` VARCHAR(500) NULL,
    `created_by` CHAR(36) NOT NULL,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `campaigns_slug_key`(`slug`),
    INDEX `campaigns_pillar_id_status_idx`(`pillar_id`, `status`),
    INDEX `campaigns_status_published_at_idx`(`status`, `published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_fund_policies` (
    `id` CHAR(36) NOT NULL,
    `campaign_id` CHAR(36) NOT NULL,
    `version` INTEGER NOT NULL,
    `policy_title` VARCHAR(200) NOT NULL,
    `policy_description` LONGTEXT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `effective_at` DATETIME(3) NOT NULL,
    `created_by` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `campaign_fund_policies_campaign_id_is_active_idx`(`campaign_id`, `is_active`),
    UNIQUE INDEX `campaign_fund_policies_campaign_id_version_key`(`campaign_id`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_updates` (
    `id` CHAR(36) NOT NULL,
    `campaign_id` CHAR(36) NOT NULL,
    `author_id` CHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `campaign_updates_campaign_id_published_at_idx`(`campaign_id`, `published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donations` (
    `id` CHAR(36) NOT NULL,
    `donation_number` VARCHAR(50) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `campaign_id` CHAR(36) NOT NULL,
    `fund_policy_id` CHAR(36) NOT NULL,
    `amount` BIGINT NOT NULL,
    `is_anonymous` BOOLEAN NOT NULL DEFAULT true,
    `donor_display_name` VARCHAR(150) NULL,
    `status` ENUM('PENDING_PAYMENT', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `donations_donation_number_key`(`donation_number`),
    INDEX `donations_user_id_created_at_idx`(`user_id`, `created_at`),
    INDEX `donations_campaign_id_status_idx`(`campaign_id`, `status`),
    INDEX `donations_fund_policy_id_idx`(`fund_policy_id`),
    INDEX `donations_status_paid_at_idx`(`status`, `paid_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_attempts` (
    `id` CHAR(36) NOT NULL,
    `donation_id` CHAR(36) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `provider_order_id` VARCHAR(100) NOT NULL,
    `provider_transaction_id` VARCHAR(150) NULL,
    `payment_method` VARCHAR(80) NULL,
    `amount` BIGINT NOT NULL,
    `status` ENUM('PENDING', 'SETTLEMENT', 'CAPTURE', 'DENY', 'CANCEL', 'EXPIRE', 'FAILED', 'REFUND', 'PARTIAL_REFUND') NOT NULL DEFAULT 'PENDING',
    `checkout_url` VARCHAR(1000) NULL,
    `expires_at` DATETIME(3) NULL,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_attempts_provider_order_id_key`(`provider_order_id`),
    INDEX `payment_attempts_donation_id_status_idx`(`donation_id`, `status`),
    INDEX `payment_attempts_provider_transaction_id_idx`(`provider_transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_events` (
    `id` CHAR(36) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `event_key` VARCHAR(191) NOT NULL,
    `provider_order_id` VARCHAR(100) NULL,
    `payload` JSON NOT NULL,
    `signature_valid` BOOLEAN NOT NULL DEFAULT false,
    `processing_status` VARCHAR(30) NOT NULL DEFAULT 'RECEIVED',
    `processed_at` DATETIME(3) NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `webhook_events_provider_order_id_idx`(`provider_order_id`),
    INDEX `webhook_events_processing_status_created_at_idx`(`processing_status`, `created_at`),
    UNIQUE INDEX `webhook_events_provider_event_key_key`(`provider`, `event_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_status_history` (
    `id` CHAR(36) NOT NULL,
    `donation_id` CHAR(36) NOT NULL,
    `from_status` ENUM('PENDING_PAYMENT', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED') NULL,
    `to_status` ENUM('PENDING_PAYMENT', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED') NOT NULL,
    `reason` TEXT NULL,
    `actor_user_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `donation_status_history_donation_id_created_at_idx`(`donation_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_receipts` (
    `id` CHAR(36) NOT NULL,
    `donation_id` CHAR(36) NOT NULL,
    `receipt_number` VARCHAR(60) NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `file_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `donation_receipts_donation_id_key`(`donation_id`),
    UNIQUE INDEX `donation_receipts_receipt_number_key`(`receipt_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `id` CHAR(36) NOT NULL,
    `donation_id` CHAR(36) NOT NULL,
    `payment_attempt_id` CHAR(36) NULL,
    `amount` BIGINT NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `provider_refund_id` VARCHAR(150) NULL,
    `approved_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `refunds_donation_id_status_idx`(`donation_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allocations` (
    `id` CHAR(36) NOT NULL,
    `allocation_number` VARCHAR(50) NOT NULL,
    `campaign_id` CHAR(36) NOT NULL,
    `amount` BIGINT NOT NULL,
    `purpose` TEXT NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `requested_by` CHAR(36) NOT NULL,
    `requested_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approved_at` DATETIME(3) NULL,
    `rejected_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `allocations_allocation_number_key`(`allocation_number`),
    INDEX `allocations_campaign_id_status_idx`(`campaign_id`, `status`),
    INDEX `allocations_requested_by_requested_at_idx`(`requested_by`, `requested_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allocation_approval_events` (
    `id` CHAR(36) NOT NULL,
    `allocation_id` CHAR(36) NOT NULL,
    `reviewer_id` CHAR(36) NOT NULL,
    `decision` ENUM('APPROVED', 'REJECTED') NOT NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `allocation_approval_events_allocation_id_key`(`allocation_id`),
    INDEX `allocation_approval_events_reviewer_id_created_at_idx`(`reviewer_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disbursements` (
    `id` CHAR(36) NOT NULL,
    `allocation_id` CHAR(36) NOT NULL,
    `amount` BIGINT NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `disbursed_at` DATETIME(3) NULL,
    `recipient_description` TEXT NOT NULL,
    `proof_url` VARCHAR(500) NULL,
    `recorded_by` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `disbursements_allocation_id_status_idx`(`allocation_id`, `status`),
    INDEX `disbursements_disbursed_at_idx`(`disbursed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` CHAR(36) NOT NULL,
    `author_id` CHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(500) NULL,
    `content` LONGTEXT NOT NULL,
    `cover_image` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `articles_slug_key`(`slug`),
    INDEX `articles_status_published_at_idx`(`status`, `published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `actor_user_id` CHAR(36) NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(100) NOT NULL,
    `entityId` VARCHAR(100) NOT NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_entity_type_entityId_idx`(`entity_type`, `entityId`),
    INDEX `audit_logs_actor_user_id_created_at_idx`(`actor_user_id`, `created_at`),
    INDEX `audit_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_pillar_id_fkey` FOREIGN KEY (`pillar_id`) REFERENCES `pillars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_fund_policies` ADD CONSTRAINT `campaign_fund_policies_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_fund_policies` ADD CONSTRAINT `campaign_fund_policies_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_updates` ADD CONSTRAINT `campaign_updates_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_updates` ADD CONSTRAINT `campaign_updates_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_fund_policy_id_fkey` FOREIGN KEY (`fund_policy_id`) REFERENCES `campaign_fund_policies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_attempts` ADD CONSTRAINT `payment_attempts_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_status_history` ADD CONSTRAINT `donation_status_history_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_status_history` ADD CONSTRAINT `donation_status_history_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_receipts` ADD CONSTRAINT `donation_receipts_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_payment_attempt_id_fkey` FOREIGN KEY (`payment_attempt_id`) REFERENCES `payment_attempts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation_approval_events` ADD CONSTRAINT `allocation_approval_events_allocation_id_fkey` FOREIGN KEY (`allocation_id`) REFERENCES `allocations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation_approval_events` ADD CONSTRAINT `allocation_approval_events_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disbursements` ADD CONSTRAINT `disbursements_allocation_id_fkey` FOREIGN KEY (`allocation_id`) REFERENCES `allocations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disbursements` ADD CONSTRAINT `disbursements_recorded_by_fkey` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
