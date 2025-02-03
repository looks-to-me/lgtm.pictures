CREATE TABLE `post_copies` (
	`post_id` text NOT NULL,
	`ip_address` text NOT NULL,
	`copied_at` integer NOT NULL,
        -- NOTE: A bug in the Drizzle ORM prevented the composite primary key from being ordered as intended, so it was rewritten manually
        -- @see: https://github.com/drizzle-team/drizzle-kit-mirror/issues/110
	PRIMARY KEY(`copied_at`, `post_id`, `ip_address`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
