ALTER TABLE `users` RENAME `display_name` TO `_display_name`;
--> statement-breakpoint
ALTER TABLE `users` ADD `display_name` text;
--> statement-breakpoint
UPDATE `users` SET `display_name` = `_display_name`;
--> statement-breakpoint
ALTER TABLE `users` DROP `_display_name`;
