import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { sliders } from "@/db/schema/sliders";

export const getSliders = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(sliders);
	},
);

export const getActiveSliders = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(sliders).where(eq(sliders.sliderActive, 1));
	},
);

export const createSlider = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			sliderTitle?: string;
			sliderDesc?: string;
			sliderActive?: number;
			sliderImage?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(sliders).values({
			sliderTitle: data.sliderTitle ?? null,
			sliderDesc: data.sliderDesc ?? null,
			sliderActive: data.sliderActive ?? 1,
			sliderImage: data.sliderImage ?? null,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateSlider = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			sliderId: number;
			sliderTitle?: string;
			sliderDesc?: string;
			sliderActive?: number;
			sliderImage?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(sliders)
			.set({
				sliderTitle: data.sliderTitle ?? null,
				sliderDesc: data.sliderDesc ?? null,
				sliderActive: data.sliderActive ?? 1,
				sliderImage: data.sliderImage ?? null,
				updatedAt: now,
			})
			.where(eq(sliders.sliderId, data.sliderId));
	});

export const deleteSlider = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(sliders).where(eq(sliders.sliderId, id));
	});
