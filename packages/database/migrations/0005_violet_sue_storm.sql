ALTER TABLE `user_providers` RENAME COLUMN `provider` TO `type`;--> statement-breakpoint
DROP INDEX IF EXISTS `user_providers_provider_sub_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_providers_type_sub_unique` ON `user_providers` (`type`,`sub`);