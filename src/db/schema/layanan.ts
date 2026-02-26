import {
	bigint,
	mysqlTable,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const layanan = mysqlTable("layanan", {
	layananId: bigint("layanan_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	nama: varchar({ length: 190 }),
	tipe: varchar({ length: 190 }),
	active: tinyint(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});
