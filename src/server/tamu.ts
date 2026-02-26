import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { tamu } from "@/db/schema/tamu";

export const getTamu = createServerFn({ method: "GET" }).handler(async () => {
	return db.select().from(tamu);
});

export const createTamu = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			nama: string;
			nip?: string;
			jk?: string;
			umur?: number;
			pendidikan?: string;
			pekerjaan?: string;
			status?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(tamu).values({
			nama: data.nama,
			nip: data.nip ?? null,
			jk: data.jk ?? null,
			umur: data.umur ?? null,
			pendidikan: data.pendidikan ?? null,
			pekerjaan: data.pekerjaan ?? null,
			status: data.status ?? null,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateTamu = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			tamuId: number;
			nama: string;
			nip?: string;
			jk?: string;
			umur?: number;
			pendidikan?: string;
			pekerjaan?: string;
			status?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(tamu)
			.set({
				nama: data.nama,
				nip: data.nip ?? null,
				jk: data.jk ?? null,
				umur: data.umur ?? null,
				pendidikan: data.pendidikan ?? null,
				pekerjaan: data.pekerjaan ?? null,
				status: data.status ?? null,
				updatedAt: now,
			})
			.where(eq(tamu.tamuId, data.tamuId));
	});

export const deleteTamu = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(tamu).where(eq(tamu.tamuId, id));
	});
