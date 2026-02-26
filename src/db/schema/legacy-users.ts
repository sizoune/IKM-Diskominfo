import {
	bigint,
	mysqlTable,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

/** Legacy users table from Laravel app. Read-only, used for migration. */
export const legacyUsers = mysqlTable("users", {
	userId: bigint("user_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	name: varchar({ length: 190 }).notNull(),
	username: varchar({ length: 190 }).notNull(),
	email: varchar({ length: 190 }),
	firebaseToken: text("firebase_token"),
	emailVerifiedAt: timestamp("email_verified_at", { mode: "string" }),
	password: varchar({ length: 190 }).notNull(),
	apiToken: text("api_token"),
	role: varchar({ length: 190 }).default("admin").notNull(),
	avatar: varchar({ length: 190 }),
	active: tinyint().default(1).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});
