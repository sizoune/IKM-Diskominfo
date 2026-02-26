import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { user } from "@/db/schema/auth";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	return db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			role: user.role,
			banned: user.banned,
			createdAt: user.createdAt,
		})
		.from(user);
});

export const getUserById = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const [u] = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				username: user.username,
				role: user.role,
				banned: user.banned,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(eq(user.id, id));
		return u ?? null;
	});

export const updateUserRole = createServerFn({ method: "POST" })
	.inputValidator((data: { userId: string; role: string }) => data)
	.handler(async ({ data }) => {
		await db
			.update(user)
			.set({ role: data.role, updatedAt: new Date() })
			.where(eq(user.id, data.userId));
	});

export const toggleBanUser = createServerFn({ method: "POST" })
	.inputValidator((data: { userId: string; banned: boolean }) => data)
	.handler(async ({ data }) => {
		await db
			.update(user)
			.set({ banned: data.banned, updatedAt: new Date() })
			.where(eq(user.id, data.userId));
	});
