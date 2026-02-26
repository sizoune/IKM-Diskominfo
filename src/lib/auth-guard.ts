import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		return session;
	},
);

export async function requireAuth() {
	const session = await getSession();
	if (!session) {
		throw redirect({ to: "/login" });
	}
	return session;
}

export async function requireRole(role: string) {
	const session = await requireAuth();
	if (session.user.role !== role) {
		throw redirect({ to: "/admin" });
	}
	return session;
}
