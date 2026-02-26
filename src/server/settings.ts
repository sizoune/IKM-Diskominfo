import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { setting } from "@/db/schema/settings";

export const getSettings = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(setting).orderBy(setting.settingOrder);
	},
);

export const updateSetting = createServerFn({ method: "POST" })
	.inputValidator((data: { settingId: number; settingValue?: string }) => data)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(setting)
			.set({
				settingValue: data.settingValue ?? null,
				updatedAt: now,
			})
			.where(eq(setting.settingId, data.settingId));
	});

export const createSetting = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			settingKey: string;
			settingName: string;
			settingOrder?: number;
			settingInput?: string;
			settingValue?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(setting).values({
			settingKey: data.settingKey,
			settingName: data.settingName,
			settingOrder: data.settingOrder ?? 0,
			settingInput: data.settingInput ?? "text",
			settingValue: data.settingValue ?? null,
			settingRemovable: 1,
			createdAt: now,
			updatedAt: now,
		});
	});

export const deleteSetting = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(setting).where(eq(setting.settingId, id));
	});
