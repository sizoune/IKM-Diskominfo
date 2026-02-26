import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { layanan } from "@/db/schema/layanan";

export const getLayanan = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(layanan);
	},
);

export const getActiveLayanan = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(layanan).where(eq(layanan.active, 1));
	},
);

export const createLayanan = createServerFn({ method: "POST" })
	.inputValidator((data: { nama: string; tipe?: string; active?: number }) => data)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(layanan).values({
			nama: data.nama,
			tipe: data.tipe ?? null,
			active: data.active ?? 1,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateLayanan = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			layananId: number;
			nama: string;
			tipe?: string;
			active?: number;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(layanan)
			.set({
				nama: data.nama,
				tipe: data.tipe ?? null,
				active: data.active ?? 1,
				updatedAt: now,
			})
			.where(eq(layanan.layananId, data.layananId));
	});

export const deleteLayanan = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(layanan).where(eq(layanan.layananId, id));
	});
