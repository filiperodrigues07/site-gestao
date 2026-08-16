CREATE TABLE `ch_api_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`base_url` text NOT NULL,
	`token` text NOT NULL,
	`chave_empresa` text NOT NULL,
	`cnpj_estrutura` text NOT NULL,
	`chave_conta_bancaria` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
