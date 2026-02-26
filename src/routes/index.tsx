import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BarChart3,
	CheckCircle2,
	ClipboardList,
	Shield,
	Star,
	Users,
} from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "IKM — Indeks Kepuasan Masyarakat | Diskominfo" },
			{
				name: "description",
				content:
					"Sistem survei Indeks Kepuasan Masyarakat (IKM) terhadap pelayanan publik Dinas Komunikasi dan Informatika Kabupaten Tabalong.",
			},
			{
				property: "og:title",
				content: "IKM — Indeks Kepuasan Masyarakat | Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Sistem survei Indeks Kepuasan Masyarakat (IKM) terhadap pelayanan publik Dinas Komunikasi dan Informatika Kabupaten Tabalong.",
			},
			{ property: "og:url", content: "https://ikm.kominfo.go.id/" },
		],
	}),
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />

			{/* Hero */}
			<section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 px-4 py-20 text-center text-white md:py-32">
				{/* Decorative orbs */}
				<div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl animate-float" />
				<div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-purple-400/20 blur-3xl" />
				<div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-indigo-500/10 blur-3xl" />

				<div className="relative mx-auto max-w-3xl">
					<div className="mb-6 flex justify-center">
						<div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 ring-1 ring-white/20 shadow-2xl">
							<img
								src="/komdigi.png"
								alt="Logo Diskominfo Tabalong"
								className="h-16 w-auto object-contain"
							/>
						</div>
					</div>
					<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-indigo-100 ring-1 ring-white/20">
						<Star className="size-3.5 fill-indigo-200 text-indigo-200" />
						Dinas Komunikasi dan Informatika Kabupaten Tabalong
					</div>
					<h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
						Indeks Kepuasan
						<br />
						<span className="text-indigo-200">Masyarakat</span>
					</h1>
					<p className="mt-4 text-lg text-indigo-100 leading-relaxed">
						Dinas Komunikasi dan Informatika — Survei Kepuasan Masyarakat
						<br className="hidden md:inline" />
						terhadap Pelayanan Publik
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							asChild
							size="lg"
							className="min-h-[44px] bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-900/30 font-semibold px-8"
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
							className="min-h-[44px] border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-8"
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
			<section className="px-4 py-16 bg-gradient-to-b from-background to-indigo-50/50">
				<div className="mx-auto max-w-5xl">
					<div className="mb-10 text-center">
						<h2 className="text-2xl font-bold text-indigo-900 md:text-3xl">
							Layanan Kami
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Sistem penilaian pelayanan publik yang transparan dan akuntabel
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<FeatureCard
							icon={<ClipboardList className="size-6 text-white" />}
							gradient="from-emerald-500 to-teal-500"
							title="Survey Pelayanan"
							description="Sampaikan penilaian Anda terhadap kualitas pelayanan publik secara mudah dan cepat melalui formulir digital kami."
						/>
						<FeatureCard
							icon={<Shield className="size-6 text-white" />}
							gradient="from-indigo-500 to-violet-500"
							title="Transparansi Data"
							description="Hasil survey terbuka untuk publik sebagai bentuk akuntabilitas dan komitmen pemerintah terhadap pelayanan prima."
						/>
						<FeatureCard
							icon={<BarChart3 className="size-6 text-white" />}
							gradient="from-violet-500 to-purple-600"
							title="Hasil Real-time"
							description="Pantau indeks kepuasan masyarakat secara real-time dengan visualisasi data yang selalu diperbarui secara berkala."
						/>
					</div>
				</div>
			</section>

			{/* Tentang IKM */}
			<section className="px-4 py-16 bg-white">
				<div className="mx-auto max-w-5xl">
					<div className="grid gap-10 md:grid-cols-2 md:items-center">
						<div>
							<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
								<Users className="size-3.5" />
								Tentang IKM
							</div>
							<h2 className="text-2xl font-bold text-indigo-900 md:text-3xl leading-tight">
								Apa itu Indeks Kepuasan Masyarakat?
							</h2>
							<p className="mt-4 text-sm text-gray-600 leading-relaxed">
								Indeks Kepuasan Masyarakat (IKM) adalah data dan informasi
								tentang tingkat kepuasan masyarakat yang diperoleh dari hasil
								pengukuran secara kuantitatif dan kualitatif atas pendapat
								masyarakat.
							</p>
							<p className="mt-3 text-sm text-gray-600 leading-relaxed">
								Pengukuran IKM bertujuan untuk mengetahui tingkat kinerja unit
								pelayanan secara berkala, sebagai bahan untuk menetapkan
								kebijakan dalam rangka peningkatan kualitas pelayanan publik.
							</p>
							<div className="mt-6 flex flex-col gap-3">
								{[
									"Meningkatkan kualitas pelayanan publik",
									"Mendorong partisipasi masyarakat",
									"Akuntabilitas dan transparansi pemerintah",
								].map((item) => (
									<div key={item} className="flex items-start gap-2.5">
										<CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
										<span className="text-sm text-gray-700">{item}</span>
									</div>
								))}
							</div>
						</div>
						<div className="relative">
							<div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-2xl shadow-indigo-200">
								<div className="mb-4 flex justify-center">
									<img
										src="/komdigi.png"
										alt="Logo Diskominfo Tabalong"
										className="h-14 w-auto object-contain opacity-90"
									/>
								</div>
								<h3 className="text-center text-lg font-bold">
									Dinas Komunikasi dan Informatika
									<br />
									Kabupaten Tabalong
								</h3>
								<p className="mt-2 text-center text-sm text-indigo-200">
									Sistem Survei Kepuasan Masyarakat
								</p>
								<div className="mt-6 grid grid-cols-2 gap-4">
									<div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
										<p className="text-2xl font-bold">9</p>
										<p className="text-xs text-indigo-200 mt-1">
											Unsur Penilaian
										</p>
									</div>
									<div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
										<p className="text-2xl font-bold">4</p>
										<p className="text-xs text-indigo-200 mt-1">
											Kategori Mutu
										</p>
									</div>
								</div>
							</div>
							<div className="pointer-events-none absolute -bottom-4 -right-4 size-32 rounded-full bg-violet-200/50 blur-2xl" />
						</div>
					</div>
				</div>
			</section>

			{/* Cara Mengisi Survey */}
			<section className="px-4 py-16 bg-gradient-to-b from-indigo-50/50 to-background">
				<div className="mx-auto max-w-4xl">
					<div className="mb-10 text-center">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
							<ClipboardList className="size-3.5" />
							Panduan
						</div>
						<h2 className="text-2xl font-bold text-indigo-900 md:text-3xl">
							Cara Mengisi Survey
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Tiga langkah mudah untuk berpartisipasi dalam survey IKM
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{[
							{
								step: "01",
								title: "Buka Formulir Survey",
								desc: 'Klik tombol "Mulai Survey" dan akses formulir penilaian yang tersedia secara online tanpa perlu membuat akun.',
							},
							{
								step: "02",
								title: "Isi Penilaian",
								desc: "Berikan penilaian jujur pada setiap aspek pelayanan berdasarkan pengalaman langsung Anda.",
							},
							{
								step: "03",
								title: "Kirim & Selesai",
								desc: "Setelah semua pertanyaan terisi, kirim jawaban Anda. Hasil akan langsung terekam dalam sistem IKM.",
							},
						].map(({ step, title, desc }) => (
							<div
								key={step}
								className="relative rounded-xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
							>
								<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-lg font-bold shadow-md shadow-indigo-200">
									{step}
								</div>
								<h3 className="mb-2 text-base font-semibold text-indigo-900">
									{title}
								</h3>
								<p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
							</div>
						))}
					</div>
					<div className="mt-10 text-center">
						<Button
							asChild
							size="lg"
							className="min-h-[44px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 font-semibold px-10"
						>
							<Link to="/guest/survey">
								<ClipboardList className="mr-2 size-5" />
								Isi Survey Sekarang
							</Link>
						</Button>
					</div>
				</div>
			</section>

			<PublicFooter />
		</div>
	);
}

function FeatureCard({
	icon,
	gradient,
	title,
	description,
}: {
	icon: React.ReactNode;
	gradient: string;
	title: string;
	description: string;
}) {
	return (
		<div className="group cursor-pointer rounded-xl border border-indigo-100/60 bg-white/80 backdrop-blur-sm shadow-md p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-200">
			<div
				className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
			>
				{icon}
			</div>
			<h3 className="mb-2 text-base font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors">
				{title}
			</h3>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	);
}
