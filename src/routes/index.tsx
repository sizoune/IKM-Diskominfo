import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ClipboardList, Shield, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { LiveDataCard } from "@/components/live-data-card";
import { PixelBlocks } from "@/components/pixel-blocks";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { getMutu } from "@/lib/ikm";
import { getAvailableYears, getIkmData } from "@/server/ikm";

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
	const currentYear = new Date().getFullYear();

	const { data: years = [] } = useQuery({
		queryKey: ["ikm-years"],
		queryFn: () => getAvailableYears(),
	});

	const displayYear = years.length > 0 ? Math.max(...years) : currentYear - 1;

	const { data: ikmData = [] } = useQuery({
		queryKey: ["ikm-data", displayYear],
		queryFn: () => getIkmData({ data: displayYear }),
		enabled: years.length > 0,
	});

	const hasData = ikmData.length > 0;
	const totalAvg = hasData
		? ikmData.reduce((sum, d) => sum + d.avgValue, 0) / ikmData.length
		: 0;
	const overall = hasData ? getMutu(totalAvg) : null;
	const totalResponden = hasData
		? Math.max(...ikmData.map((d) => d.totalResponden))
		: 0;
	const unsurCount = ikmData.length;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />

			{/* === Hero === */}
			<section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 px-4 py-16 md:py-20">
				<PixelBlocks className="absolute top-16 right-8 hidden md:grid" />
				<div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
					<div>
						<span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[var(--amber-soft)] px-3 py-1.5 text-[11px] font-bold text-amber-800">
							<span className="size-1.5 rounded-full bg-[var(--amber)]" />
							Survei Resmi {currentYear} · Terbuka untuk warga
						</span>
						<h1 className="text-3xl font-black leading-[1.05] tracking-tight text-[var(--navy)] md:text-5xl">
							Suara Anda,
							<br />
							arah <span className="accent-underline">pelayanan</span>
							<br />
							<span className="text-[var(--blue)]">kami.</span>
						</h1>
						<p className="mt-4 max-w-md text-base leading-relaxed text-slate-700">
							Berpartisipasilah dalam Indeks Kepuasan Masyarakat Diskominfo
							Kabupaten Tabalong. Pendapat Anda menjadi bahan evaluasi nyata
							untuk pelayanan publik yang lebih baik.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Button
								asChild
								size="lg"
								className="min-h-[44px] bg-[var(--navy)] px-6 font-bold text-white hover:bg-[var(--navy-2)]"
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
								className="min-h-[44px] border-slate-200 px-6 font-bold text-[var(--navy)]"
							>
								<Link to="/guest/ikm">
									<BarChart3 className="mr-2 size-5" />
									Lihat Hasil IKM
								</Link>
							</Button>
						</div>
						<div className="mt-7 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-5 text-[11px] text-muted-foreground">
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									5 menit
								</div>
								<div>Waktu pengisian</div>
							</div>
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									Anonim
								</div>
								<div>Tanpa akun</div>
							</div>
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									Real-time
								</div>
								<div>Data terbuka</div>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<LiveDataCard
							year={displayYear}
							score={hasData ? totalAvg : null}
							mutuLabel={
								overall
									? `MUTU ${overall.grade} · ${overall.label.toUpperCase()}`
									: "MENUNGGU DATA"
							}
						/>
						<div className="grid grid-cols-2 gap-2.5">
							<div className="rounded-xl border border-slate-200 bg-white p-3.5">
								<div className="text-xl font-black text-[var(--navy)]">
									{hasData ? totalResponden.toLocaleString("id-ID") : "—"}
								</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
									Responden
								</div>
							</div>
							<div className="rounded-xl border border-amber-200 bg-[var(--amber-soft)] p-3.5">
								<div className="text-xl font-black text-amber-800">
									{hasData ? unsurCount : "—"}
								</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
									Unsur Nilai
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* === Stats Banner === */}
			<section className="relative overflow-hidden bg-[var(--navy)] px-4 py-10 text-white">
				<div className="pointer-events-none absolute -top-10 -right-10 size-[200px] rounded-full border border-sky-400/20" />
				<div className="pointer-events-none absolute -top-5 -right-5 size-[160px] rounded-full border border-sky-400/10" />
				<div className="container relative mx-auto grid max-w-5xl gap-6 md:grid-cols-4">
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">
							<span className="text-[var(--amber)]">
								{hasData ? totalAvg.toFixed(2) : "—"}
							</span>
							<span className="text-base text-slate-400">/4.00</span>
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Indeks Tahun {displayYear}
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">
							{hasData ? totalResponden.toLocaleString("id-ID") : "—"}
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Total Responden
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">
							{hasData ? unsurCount : "—"}{" "}
							<span className="text-sm text-slate-400">unsur</span>
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Aspek Penilaian
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl text-[var(--amber)]">
							{overall ? overall.grade : "—"}
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Mutu Pelayanan
						</div>
					</div>
				</div>
			</section>

			{/* === Layanan === */}
			<section className="px-4 py-16">
				<div className="container mx-auto max-w-5xl">
					<SectionHeader
						kicker="Layanan Kami"
						title="Sistem penilaian"
						titleAccent="yang transparan"
						subtitle="Tiga pilar utama platform IKM Diskominfo Tabalong untuk memastikan akuntabilitas pelayanan publik."
					/>
					<div className="grid gap-4 md:grid-cols-3">
						<FeatureCard
							accent="navy"
							icon={<ClipboardList className="size-5" />}
							title="Survey Pelayanan"
							description="Formulir digital mudah diisi tanpa registrasi. Sampaikan penilaian Anda dalam 5 menit dengan 9 unsur kepuasan."
						/>
						<FeatureCard
							accent="red"
							icon={<Shield className="size-5" />}
							title="Transparansi Data"
							description="Hasil survei terbuka untuk publik. Komitmen pemerintah terhadap akuntabilitas pelayanan prima."
						/>
						<FeatureCard
							accent="amber"
							icon={<BarChart3 className="size-5" />}
							title="Hasil Real-time"
							description="Pantau indeks kepuasan masyarakat dengan visualisasi data yang diperbarui secara berkala."
						/>
					</div>
				</div>
			</section>

			{/* === Tentang IKM === */}
			<section className="bg-slate-50 px-4 py-16">
				<div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
					<div>
						<SectionHeader
							kicker="Tentang IKM"
							title="Apa itu Indeks"
							titleAccent="Kepuasan Masyarakat?"
							align="left"
						/>
						<p className="text-sm leading-relaxed text-slate-700">
							Indeks Kepuasan Masyarakat (IKM) adalah pengukuran kuantitatif dan
							kualitatif tingkat kepuasan masyarakat terhadap pelayanan publik.
							Bertujuan mengetahui kinerja unit pelayanan secara berkala sebagai
							bahan kebijakan peningkatan kualitas.
						</p>
						<div className="mt-5 flex flex-col gap-2.5">
							{[
								"Meningkatkan kualitas pelayanan publik secara berkelanjutan",
								"Mendorong partisipasi aktif masyarakat",
								"Akuntabilitas dan transparansi pemerintah daerah",
							].map((item) => (
								<div key={item} className="flex items-start gap-2.5">
									<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-[var(--amber-soft)] text-[11px] font-black text-amber-800">
										✓
									</span>
									<span className="text-sm text-slate-700">{item}</span>
								</div>
							))}
						</div>
					</div>
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[var(--navy-2)] p-8 text-white">
						<div className="absolute -bottom-2 -right-2 rotate-[-12deg] opacity-15">
							<PixelBlocks size={18} gap={4} opacity={1} />
						</div>
						<span className="mb-3 inline-block rounded bg-[var(--amber)] px-2 py-0.5 text-[10px] font-black tracking-wider text-[var(--navy)]">
							★ DISKOMINFO TABALONG
						</span>
						<h4 className="text-xl font-black">Sistem Survei IKM</h4>
						<div className="mt-1 text-xs text-[var(--sky)]">
							Berbasis Permenpan RB 14/2017
						</div>
						<div className="mt-6 grid grid-cols-2 gap-2.5">
							<div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
								<div className="text-2xl font-black text-[var(--amber)]">9</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									Unsur Penilaian
								</div>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
								<div className="text-2xl font-black text-[var(--amber)]">4</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									Kategori Mutu
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* === Cara Mengisi Survey === */}
			<section className="px-4 py-16">
				<div className="container mx-auto max-w-4xl">
					<SectionHeader
						kicker="Panduan"
						title="Tiga langkah"
						titleAccent="mudah"
						subtitle="Berpartisipasi dalam survei IKM hanya butuh 5 menit. Tidak perlu akun, sepenuhnya anonim."
					/>
					<div className="grid gap-4 md:grid-cols-3">
						{[
							{
								step: "01",
								title: "Buka Formulir",
								desc: 'Klik "Mulai Survey" dan akses formulir penilaian online tanpa perlu membuat akun.',
							},
							{
								step: "02",
								title: "Isi Penilaian",
								desc: "Berikan penilaian jujur pada setiap aspek pelayanan berdasarkan pengalaman Anda.",
							},
							{
								step: "03",
								title: "Kirim & Selesai",
								desc: "Setelah semua pertanyaan terisi, kirim jawaban. Hasil langsung terekam dalam sistem.",
							},
						].map(({ step, title, desc }) => (
							<div
								key={step}
								className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
							>
								<span className="absolute top-4 right-5 text-4xl font-black text-slate-100">
									{step}
								</span>
								<div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									Langkah {step}
								</div>
								<h4 className="mt-2 mb-2 text-base font-extrabold text-[var(--navy)]">
									{title}
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* === CTA Banner === */}
			<section className="bg-slate-50 px-4 pt-4 pb-16">
				<div className="container mx-auto max-w-5xl">
					<div className="relative grid gap-6 overflow-hidden rounded-2xl bg-[var(--navy)] p-8 text-white md:grid-cols-[2fr_1fr] md:items-center md:p-10">
						<div
							className="pointer-events-none absolute -bottom-10 -left-10 size-[200px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)",
							}}
							aria-hidden
						/>
						<div className="relative">
							<h3 className="text-2xl font-black leading-tight md:text-3xl">
								Siap berkontribusi untuk pelayanan{" "}
								<span className="text-[var(--amber)]">yang lebih baik?</span>
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-300">
								Mulai isi survei IKM sekarang. Setiap suara membantu Diskominfo
								Tabalong meningkatkan kualitas layanan publik.
							</p>
						</div>
						<div className="relative">
							<Button
								asChild
								size="lg"
								className="min-h-[48px] w-full bg-[var(--amber)] font-black tracking-wide text-[var(--navy)] hover:bg-amber-400"
							>
								<Link to="/guest/survey">
									<Sparkles className="mr-2 size-5" />
									ISI SURVEY SEKARANG
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<PublicFooter />
		</div>
	);
}
