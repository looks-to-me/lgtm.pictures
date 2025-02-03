CREATE TABLE `mute_users` (
	`user_id` text NOT NULL,
	`mute_user_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `mute_user_id`),-- NOTE: A bug in the Drizzle ORM prevented the composite primary key from being ordered as intended, so it was rewritten manually
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mute_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
