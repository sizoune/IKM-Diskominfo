import { createServerFn } from "@tanstack/react-start";
import { deleteFile, getFileUrl, uploadFile } from "@/lib/storage";

export const uploadImage = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { fileName: string; base64: string; contentType: string }) => data,
	)
	.handler(async ({ data }) => {
		const buffer = Buffer.from(data.base64, "base64");
		const ext = data.fileName.split(".").pop() || "jpg";
		const key = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		await uploadFile(key, buffer, data.contentType);
		return { key };
	});

export const getImageUrl = createServerFn({ method: "GET" })
	.inputValidator((key: string) => key)
	.handler(async ({ data: key }) => {
		if (!key) return null;
		return getFileUrl(key);
	});

export const deleteImage = createServerFn({ method: "POST" })
	.inputValidator((key: string) => key)
	.handler(async ({ data: key }) => {
		await deleteFile(key);
	});
