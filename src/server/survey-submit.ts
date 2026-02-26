import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { answers, surveys } from "@/db/schema/surveys";
import { tamu } from "@/db/schema/tamu";

interface SurveySubmitData {
	formId: number;
	layananId: number;
	status: string;
	nama: string;
	nip?: string;
	jk: string;
	umur: number;
	pendidikan: string;
	pekerjaan: string;
	saran?: string;
	answers: Array<{ formQuestionId: number; value: number }>;
}

export const submitSurvey = createServerFn({ method: "POST" })
	.inputValidator((data: SurveySubmitData) => data)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		const today = new Date().toISOString().slice(0, 10);

		// Check if user already submitted survey today (by NIP if ASN)
		if (data.nip) {
			const existing = await db
				.select({ count: sql<number>`count(*)` })
				.from(surveys)
				.innerJoin(tamu, eq(surveys.tamuId, tamu.tamuId))
				.where(and(eq(tamu.nip, data.nip), eq(surveys.date, today)));
			if (existing[0] && existing[0].count > 0) {
				throw new Error("Anda sudah mengisi survey hari ini.");
			}
		}

		// Create tamu record
		const [tamuResult] = await db.insert(tamu).values({
			nama: data.nama,
			nip: data.nip ?? null,
			jk: data.jk,
			umur: data.umur,
			pendidikan: data.pendidikan,
			pekerjaan: data.pekerjaan,
			status: data.status,
			createdAt: now,
			updatedAt: now,
		});

		const tamuId = tamuResult.insertId;

		// Calculate total
		const totalNilai = data.answers.reduce((sum, a) => sum + a.value, 0);
		const total =
			data.answers.length > 0
				? (totalNilai / data.answers.length) * (25 / 4)
				: 0;

		// Create survey record
		const [surveyResult] = await db.insert(surveys).values({
			tamuId: Number(tamuId),
			layananId: data.layananId,
			formId: data.formId,
			date: today,
			total,
			saran: data.saran ?? null,
			createdAt: now,
			updatedAt: now,
		});

		const surveyId = surveyResult.insertId;

		// Create answer records
		if (data.answers.length > 0) {
			await db.insert(answers).values(
				data.answers.map((a) => ({
					formQuestionId: a.formQuestionId,
					surveyId: Number(surveyId),
					value: a.value,
					createdAt: now,
					updatedAt: now,
				})),
			);
		}

		return { surveyId: Number(surveyId), total };
	});
