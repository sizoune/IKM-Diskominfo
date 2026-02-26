import { createServerFn } from "@tanstack/react-start";
import { between, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { layanan } from "@/db/schema/layanan";
import { surveys } from "@/db/schema/surveys";
import { tamu } from "@/db/schema/tamu";

export const getBukuTamuReport = createServerFn({ method: "GET" })
	.inputValidator((data: { startDate: string; endDate: string }) => data)
	.handler(async ({ data }) => {
		const rows = await db
			.select({
				tamuId: tamu.tamuId,
				nama: tamu.nama,
				nip: tamu.nip,
				jk: tamu.jk,
				umur: tamu.umur,
				pendidikan: tamu.pendidikan,
				pekerjaan: tamu.pekerjaan,
				surveyDate: surveys.date,
				layananNama: layanan.nama,
			})
			.from(tamu)
			.leftJoin(surveys, eq(surveys.tamuId, tamu.tamuId))
			.leftJoin(layanan, eq(surveys.layananId, layanan.layananId))
			.where(between(surveys.date, data.startDate, data.endDate))
			.orderBy(surveys.date);
		return rows;
	});
