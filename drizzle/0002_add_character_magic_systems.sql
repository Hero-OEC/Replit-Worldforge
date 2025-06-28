
CREATE TABLE `character_magic_systems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer NOT NULL,
	`magic_system_id` integer NOT NULL,
	`proficiency_level` text DEFAULT 'beginner',
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`magic_system_id`) REFERENCES `magic_systems`(`id`) ON UPDATE no action ON DELETE cascade
);
