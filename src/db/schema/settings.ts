import {
	bigint,
	int,
	mysqlTable,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const setting = mysqlTable("setting", {
	settingId: bigint("setting_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	settingKey: varchar("setting_key", { length: 190 }).notNull(),
	settingName: varchar("setting_name", { length: 190 }).notNull(),
	settingOrder: int("setting_order"),
	settingInput: varchar("setting_input", { length: 190 }),
	settingValue: text("setting_value"),
	settingRemovable: tinyint("setting_removable").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});
