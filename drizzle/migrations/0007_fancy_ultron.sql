CREATE INDEX `articles_category_id_idx` ON `articles` (`category_id`);--> statement-breakpoint
CREATE INDEX `articles_author_id_idx` ON `articles` (`author_id`);--> statement-breakpoint
CREATE INDEX `articles_status_idx` ON `articles` (`status`);--> statement-breakpoint
CREATE INDEX `downloads_author_id_idx` ON `downloads` (`author_id`);--> statement-breakpoint
CREATE INDEX `faqs_category_id_idx` ON `faqs` (`category_id`);--> statement-breakpoint
CREATE INDEX `updates_author_id_idx` ON `updates` (`author_id`);--> statement-breakpoint
CREATE INDEX `videos_author_id_idx` ON `videos` (`author_id`);