import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth-guard";

export const Route = createFileRoute("/login")({
	head: () => ({
		meta: [
			{ title: "Masuk — IKM Diskominfo" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
	component: LoginPage,
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({ to: "/admin" });
		}
	},
});

function LoginPage() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const id = useId();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await authClient.signIn.username({
				username,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Login gagal");
			} else {
				navigate({ to: "/admin" });
			}
		} catch {
			setError("Terjadi kesalahan. Coba lagi.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex">
			{/* Left branded panel — hidden on mobile */}
			<div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 text-white lg:flex relative overflow-hidden">
				{/* Decorative orbs */}
				<div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-purple-400/15 blur-3xl" />
				<div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-indigo-500/10 blur-3xl" />

				<div className="relative flex flex-col items-center gap-4">
					<div className="rounded-2xl bg-white/15 backdrop-blur-sm p-5 ring-1 ring-white/20 shadow-2xl">
						<img
							src="/komdigi.png"
							alt="Logo Diskominfo Tabalong"
							className="size-20 object-contain"
						/>
					</div>
					<div className="text-center">
						<h1 className="text-2xl font-bold tracking-tight">
							IKM Diskominfo
						</h1>
						<p className="mt-1 text-sm font-medium text-indigo-200">
							Dinas Komunikasi dan Informatika
							<br />
							Kabupaten Tabalong
						</p>
						<p className="mt-3 max-w-xs text-center text-sm text-indigo-300 leading-relaxed">
							Indeks Kepuasan Masyarakat — Dinas Komunikasi dan Informatika
						</p>
					</div>
				</div>
			</div>

			{/* Right form panel */}
			<div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 px-4">
				<div className="w-full max-w-sm">
					<Card className="backdrop-blur bg-white/90 border-indigo-100/60 shadow-xl shadow-indigo-100/50">
						<CardHeader className="text-center pb-2">
							<div className="mb-3 flex justify-center lg:hidden">
								<div className="rounded-xl bg-indigo-50 p-3">
									<img
										src="/komdigi.png"
										alt="Logo Diskominfo Tabalong"
										className="size-10 object-contain"
									/>
								</div>
							</div>
							<CardTitle className="text-2xl text-indigo-900">Masuk</CardTitle>
							<p className="text-sm text-muted-foreground">
								Masuk ke panel admin IKM
							</p>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor={`${id}-username`}>Username</Label>
									<Input
										id={`${id}-username`}
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Masukkan username"
										className="focus-visible:ring-violet-500"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${id}-password`}>Password</Label>
									<Input
										id={`${id}-password`}
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Masukkan password"
										className="focus-visible:ring-violet-500"
										required
									/>
								</div>
								{error && <p className="text-sm text-destructive">{error}</p>}
								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
									disabled={loading}
								>
									{loading ? "Memproses..." : "Masuk"}
								</Button>
							</form>
							<div className="mt-4 text-center">
								<Link
									to="/"
									className="text-sm text-indigo-600 hover:text-violet-600 transition-colors"
								>
									Kembali ke Beranda
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
