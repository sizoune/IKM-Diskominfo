import {
	bigint,
	int,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const tamu = mysqlTable("tamu", {
	tamuId: bigint("tamu_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	nama: varchar({ length: 190 }),
	nip: varchar({ length: 190 }),
	jk: varchar({ length: 190 }),
	umur: int(),
	pendidikan: varchar({ length: 190 }),
	pekerjaan: varchar({ length: 190 }),
	status: varchar({ length: 190 }),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});
