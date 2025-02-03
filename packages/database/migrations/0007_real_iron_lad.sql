CREATE TABLE `temp` (
    `user_id` text NOT NULL,
    `name` text NOT NULL,
    `display_name` text,
    `avatar_url` text NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX IF EXISTS `user_profiles_user_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `temp` (`user_id`);--> statement-breakpoint
INSERT INTO `temp` SELECT * FROM `user_profiles`;--> statement-breakpoint
DROP TABLE `user_profiles`;--> statement-breakpoint
ALTER TABLE `temp` RENAME TO `user_profiles`;--> statement-breakpoint
CREATE TABLE `temp` (
    `user_id` text NOT NULL,
    `type` text NOT NULL,
    `sub` text NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX IF EXISTS `user_providers_type_sub_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_providers_type_sub_unique` ON `temp` (`type`,`sub`);--> statement-breakpoint
INSERT INTO `temp` SELECT * FROM `user_providers`;--> statement-breakpoint
DROP TABLE `user_providers`;--> statement-breakpoint
ALTER TABLE `temp` RENAME TO `user_providers`;
