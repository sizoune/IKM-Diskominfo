import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, LogIn } from "lucide-react";
import { useId, useState } from "react";
import { PixelBlocks } from "@/components/pixel-blocks";
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
		<div className="flex min-h-screen flex-col">
			<div className="top-stripe-kominfo" aria-hidden />
			<div className="flex flex-1">
				{/* Left branded panel — hidden on mobile */}
				<div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--navy)] to-[var(--navy-2)] text-white lg:flex">
					<div
						className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full"
						style={{
							background:
								"radial-gradient(circle, rgba(96,165,250,0.18), transparent 70%)",
						}}
						aria-hidden
					/>
					<div
						className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full"
						style={{
							background:
								"radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)",
						}}
						aria-hidden
					/>
					<div className="pointer-events-none absolute top-12 right-12 opacity-50">
						<PixelBlocks size={16} gap={5} opacity={1} />
					</div>
					<div className="pointer-events-none absolute bottom-16 left-12 rotate-[-15deg] opacity-25">
						<PixelBlocks size={22} gap={5} opacity={1} />
					</div>

					<div className="relative flex flex-col items-center gap-5 px-8">
						<div className="grid size-24 place-items-center rounded-2xl bg-white p-4 shadow-2xl shadow-black/20">
							<img
								src="/komdigi.png"
								alt="Logo Diskominfo Tabalong"
								className="size-full object-contain"
							/>
						</div>
						<div className="max-w-sm text-center">
							<div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--amber)]">
								Sistem Survei IKM
							</div>
							<h1 className="mt-2 text-2xl font-black tracking-tight">
								DISKOMINFO TABALONG
							</h1>
							<p className="mt-3 text-sm leading-relaxed text-[var(--sky)]">
								Indeks Kepuasan Masyarakat — Dinas Komunikasi dan Informatika
								Kabupaten Tabalong
							</p>
							<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/20">
								<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
								Panel Admin
							</div>
						</div>
					</div>
				</div>

				{/* Right form panel */}
				<div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
					<div className="w-full max-w-sm">
						<Card className="overflow-hidden border-x border-b border-t-4 border-slate-200 border-t-[var(--amber)] shadow-sm">
							<CardHeader className="pb-2 text-center">
								<div className="mb-4 flex justify-center lg:hidden">
									<div className="grid size-14 place-items-center rounded-xl bg-white p-2 shadow-md ring-1 ring-slate-200">
										<img
											src="/komdigi.png"
											alt="Logo Diskominfo Tabalong"
											className="size-full object-contain"
										/>
									</div>
								</div>
								<CardTitle className="text-2xl font-black text-[var(--navy)]">
									Masuk
								</CardTitle>
								<p className="text-sm text-muted-foreground">
									Masuk ke panel admin IKM
								</p>
							</CardHeader>
							<CardContent className="pt-4">
								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="space-y-2">
										<Label
											htmlFor={`${id}-username`}
											className="text-xs font-bold text-[var(--navy)]"
										>
											Username
										</Label>
										<Input
											id={`${id}-username`}
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											placeholder="Masukkan username"
											className="min-h-[44px] focus-visible:ring-[var(--amber)]"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor={`${id}-password`}
											className="text-xs font-bold text-[var(--navy)]"
										>
											Password
										</Label>
										<Input
											id={`${id}-password`}
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Masukkan password"
											className="min-h-[44px] focus-visible:ring-[var(--amber)]"
											required
										/>
									</div>
									{error && (
										<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
											<p className="text-sm font-medium text-[var(--red)]">
												{error}
											</p>
										</div>
									)}
									<Button
										type="submit"
										className="min-h-[44px] w-full bg-[var(--navy)] font-bold text-white hover:bg-[var(--navy-2)] disabled:opacity-60"
										disabled={loading}
									>
										{loading ? (
											"Memproses..."
										) : (
											<>
												<LogIn className="mr-2 size-4" />
												Masuk
											</>
										)}
									</Button>
								</form>
								<div className="mt-5 text-center">
									<Link
										to="/"
										className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--navy)]"
									>
										<ArrowLeft className="size-3.5" />
										Kembali ke Beranda
									</Link>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
