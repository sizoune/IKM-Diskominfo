import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ClipboardList, Shield } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />

			{/* Hero */}
			<section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4 py-20 text-center text-white md:py-28">
				{/* Decorative orbs */}
				<div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-purple-400/20 blur-3xl" />

				<div className="relative mx-auto max-w-3xl">
					<h1 className="text-4xl font-bold leading-tight md:text-5xl">
						Indeks Kepuasan Masyarakat
					</h1>
					<p className="mt-4 text-lg text-indigo-100">
						Dinas Komunikasi dan Informatika — Survei Kepuasan Masyarakat
						terhadap Pelayanan Publik
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							asChild
							size="lg"
							className="min-h-[44px] bg-emerald-500 text-white hover:bg-emerald-600"
						>
							<Link to="/guest/survey">
								<ClipboardList className="mr-2 size-5" />
								Mulai Survey
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="min-h-[44px] border-white/30 text-white hover:bg-white/10"
						>
							<Link to="/guest/ikm">
								<BarChart3 className="mr-2 size-5" />
								Lihat Hasil IKM
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Feature Cards */}
			<section className="flex-1 px-4 py-16">
				<div className="mx-auto max-w-5xl">
					<div className="grid gap-6 md:grid-cols-3">
						<FeatureCard
							icon={<ClipboardList className="size-6 text-white" />}
							title="Survey Pelayanan"
							description="Sampaikan penilaian Anda terhadap kualitas pelayanan publik secara mudah dan cepat."
						/>
						<FeatureCard
							icon={<Shield className="size-6 text-white" />}
							title="Transparansi Data"
							description="Hasil survey terbuka untuk publik sebagai bentuk akuntabilitas pelayanan pemerintah."
						/>
						<FeatureCard
							icon={<BarChart3 className="size-6 text-white" />}
							title="Hasil Real-time"
							description="Pantau indeks kepuasan masyarakat secara real-time dengan data yang selalu diperbarui."
						/>
					</div>
				</div>
			</section>

			<PublicFooter />
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="cursor-pointer rounded-lg backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
			<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
				{icon}
			</div>
			<h3 className="mb-2 text-lg font-semibold">{title}</h3>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}
