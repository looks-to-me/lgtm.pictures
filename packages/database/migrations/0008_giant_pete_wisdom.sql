CREATE TABLE `post_tags` (
	`post_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`order` integer NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_tags_order_post_id_unique` ON `post_tags` (`order`,`post_id`);