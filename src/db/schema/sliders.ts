import {
	bigint,
	mysqlTable,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const sliders = mysqlTable("sliders", {
	sliderId: bigint("slider_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	sliderTitle: varchar("slider_title", { length: 190 }),
	sliderDesc: text("slider_desc"),
	sliderActive: tinyint("slider_active"),
	sliderImage: varchar("slider_image", { length: 190 }),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});
