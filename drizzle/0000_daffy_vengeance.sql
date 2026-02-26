CREATE TABLE `choices` (
	`choice_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`form_question_id` int,
	`label` varchar(190),
	`value` text,
	`kode` text,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `choices_choice_id` PRIMARY KEY(`choice_id`)
);
--> statement-breakpoint
CREATE TABLE `form_questions` (
	`form_question_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`form_id` int,
	`question_type` varchar(190) NOT NULL,
	`kode` varchar(190),
	`active` varchar(190),
	`order` int,
	`text` longtext,
	`prepend` text,
	`append` text,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `form_questions_form_question_id` PRIMARY KEY(`form_question_id`)
);
--> statement-breakpoint
CREATE TABLE `forms` (
	`form_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(190),
	`desc` varchar(190),
	`order` int,
	`active` tinyint,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `forms_form_id` PRIMARY KEY(`form_id`)
);
--> statement-breakpoint
CREATE TABLE `answers` (
	`answer_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`form_question_id` int,
	`survey_id` int,
	`answer_json` longtext,
	`value` int NOT NULL DEFAULT 0,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `answers_answer_id` PRIMARY KEY(`answer_id`)
);
--> statement-breakpoint
CREATE TABLE `surveys` (
	`survey_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tamu_id` int,
	`layanan_id` int,
	`form_id` int,
	`date` date,
	`total` double,
	`saran` text,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `surveys_survey_id` PRIMARY KEY(`survey_id`)
);
--> statement-breakpoint
CREATE TABLE `tamu` (
	`tamu_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(190),
	`nip` varchar(190),
	`jk` varchar(190),
	`umur` int,
	`pendidikan` varchar(190),
	`pekerjaan` varchar(190),
	`status` varchar(190),
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `tamu_tamu_id` PRIMARY KEY(`tamu_id`)
);
--> statement-breakpoint
CREATE TABLE `layanan` (
	`layanan_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(190),
	`tipe` varchar(190),
	`active` tinyint,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `layanan_layanan_id` PRIMARY KEY(`layanan_id`)
);
--> statement-breakpoint
CREATE TABLE `sliders` (
	`slider_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slider_title` varchar(190),
	`slider_desc` text,
	`slider_active` tinyint,
	`slider_image` varchar(190),
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `sliders_slider_id` PRIMARY KEY(`slider_id`)
);
--> statement-breakpoint
CREATE TABLE `setting` (
	`setting_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`setting_key` varchar(190) NOT NULL,
	`setting_name` varchar(190) NOT NULL,
	`setting_order` int,
	`setting_input` varchar(190),
	`setting_value` text,
	`setting_removable` tinyint NOT NULL DEFAULT 1,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `setting_setting_id` PRIMARY KEY(`setting_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(190) NOT NULL,
	`username` varchar(190) NOT NULL,
	`email` varchar(190),
	`firebase_token` text,
	`email_verified_at` timestamp,
	`password` varchar(190) NOT NULL,
	`api_token` text,
	`role` varchar(190) NOT NULL DEFAULT 'admin',
	`avatar` varchar(190),
	`active` tinyint NOT NULL DEFAULT 1,
	`remember_token` varchar(100),
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	`impersonated_by` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`username` varchar(255),
	`display_username` text,
	`role` text,
	`banned` boolean DEFAULT false,
	`ban_reason` text,
	`ban_expires` timestamp(3),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);