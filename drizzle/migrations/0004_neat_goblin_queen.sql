ALTER TABLE `downloads` ADD `author_id` integer REFERENCES users(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_admin` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `permissions` text DEFAULT '[]' NOT NULL;