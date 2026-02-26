import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { formQuestions, forms } from "@/db/schema/forms";
import { layanan } from "@/db/schema/layanan";
import { answers, surveys } from "@/db/schema/surveys";
import { tamu } from "@/db/schema/tamu";

export const getSurveys = createServerFn({ method: "GET" }).handler(
	async () => {
		const rows = await db
			.select({
				surveyId: surveys.surveyId,
				date: surveys.date,
				total: surveys.total,
				saran: surveys.saran,
				tamuNama: tamu.nama,
				layananNama: layanan.nama,
				formName: forms.name,
				createdAt: surveys.createdAt,
			})
			.from(surveys)
			.leftJoin(tamu, eq(surveys.tamuId, tamu.tamuId))
			.leftJoin(layanan, eq(surveys.layananId, layanan.layananId))
			.leftJoin(forms, eq(surveys.formId, forms.formId))
			.orderBy(surveys.surveyId);
		return rows;
	},
);

export const getSurveyById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const [survey] = await db
			.select({
				surveyId: surveys.surveyId,
				date: surveys.date,
				total: surveys.total,
				saran: surveys.saran,
				tamuNama: tamu.nama,
				tamuNip: tamu.nip,
				tamuJk: tamu.jk,
				tamuUmur: tamu.umur,
				tamuPendidikan: tamu.pendidikan,
				tamuPekerjaan: tamu.pekerjaan,
				tamuStatus: tamu.status,
				layananNama: layanan.nama,
				formName: forms.name,
				createdAt: surveys.createdAt,
			})
			.from(surveys)
			.leftJoin(tamu, eq(surveys.tamuId, tamu.tamuId))
			.leftJoin(layanan, eq(surveys.layananId, layanan.layananId))
			.leftJoin(forms, eq(surveys.formId, forms.formId))
			.where(eq(surveys.surveyId, id));

		if (!survey) return null;

		const surveyAnswers = await db
			.select({
				answerId: answers.answerId,
				value: answers.value,
				answerJson: answers.answerJson,
				questionText: formQuestions.text,
				questionKode: formQuestions.kode,
			})
			.from(answers)
			.leftJoin(
				formQuestions,
				eq(answers.formQuestionId, formQuestions.formQuestionId),
			)
			.where(eq(answers.surveyId, id));

		return { ...survey, answers: surveyAnswers };
	});
