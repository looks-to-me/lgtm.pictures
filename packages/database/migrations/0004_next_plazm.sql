CREATE TABLE `user_profiles` (
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`display_name` text,
	`avatar_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_providers` (
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`sub` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_providers_provider_sub_unique` ON `user_providers` (`provider`,`sub`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `display_name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `avatar_url`;