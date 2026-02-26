import { z } from "zod";

export const formSchema = z.object({
	name: z.string().min(1, "Nama form wajib diisi"),
	desc: z.string().optional(),
	order: z.number().int().optional(),
	active: z.number().int().min(0).max(1).optional(),
});

export const questionSchema = z.object({
	formId: z.number().int(),
	questionType: z.string().min(1),
	kode: z.string().optional(),
	active: z.string().optional(),
	order: z.number().int().optional(),
	text: z.string().min(1, "Pertanyaan wajib diisi"),
	prepend: z.string().optional(),
	append: z.string().optional(),
});

export const choiceSchema = z.object({
	formQuestionId: z.number().int(),
	label: z.string().min(1, "Label wajib diisi"),
	value: z.string().optional(),
	kode: z.string().optional(),
});

export const layananSchema = z.object({
	nama: z.string().min(1, "Nama layanan wajib diisi"),
	tipe: z.string().optional(),
	active: z.number().int().min(0).max(1).optional(),
});

export const tamuSchema = z.object({
	nama: z.string().min(1, "Nama wajib diisi"),
	nip: z.string().optional(),
	jk: z.string().optional(),
	umur: z.number().int().optional(),
	pendidikan: z.string().optional(),
	pekerjaan: z.string().optional(),
	status: z.string().optional(),
});

export const surveySubmitSchema = z.object({
	formId: z.number().int(),
	layananId: z.number().int(),
	status: z.string(),
	nama: z.string().min(1),
	nip: z.string().optional(),
	jk: z.string(),
	umur: z.number().int().min(1),
	pendidikan: z.string(),
	pekerjaan: z.string(),
	saran: z.string().optional(),
	answers: z.array(
		z.object({
			formQuestionId: z.number().int(),
			value: z.number().int().min(1).max(4),
		}),
	),
});

export const settingSchema = z.object({
	settingKey: z.string().min(1),
	settingName: z.string().min(1),
	settingOrder: z.number().int().optional(),
	settingInput: z.string().optional(),
	settingValue: z.string().optional(),
	settingRemovable: z.number().int().min(0).max(1).optional(),
});

export const sliderSchema = z.object({
	sliderTitle: z.string().optional(),
	sliderDesc: z.string().optional(),
	sliderActive: z.number().int().min(0).max(1).optional(),
	sliderImage: z.string().optional(),
});
