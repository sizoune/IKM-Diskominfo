import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, ClipboardCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMutu, getMutuBadgeClasses, getMutuFillHex } from "@/lib/ikm";
import { getAvailableYears, getIkmData } from "@/server/ikm";

export const Route = createFileRoute("/guest/ikm")({
	head: () => ({
		meta: [
			{ title: "Hasil IKM — Indeks Kepuasan Masyarakat | Diskominfo" },
			{
				name: "description",
				content:
					"Lihat hasil Indeks Kepuasan Masyarakat (IKM) — data penilaian masyarakat terhadap kualitas pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:title",
				content: "Hasil IKM — Indeks Kepuasan Masyarakat | Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Lihat hasil Indeks Kepuasan Masyarakat (IKM) — data penilaian masyarakat terhadap kualitas pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{ property: "og:url", content: "https://ikm.kominfo.go.id/guest/ikm" },
		],
	}),
	component: IkmPage,
});

function IkmPage() {
	const currentYear = new Date().getFullYear();
	const [year, setYear] = useState(currentYear);

	const { data: years = [] } = useQuery({
		queryKey: ["ikm-years"],
		queryFn: () => getAvailableYears(),
	});

	const { data: ikmData = [] } = useQuery({
		queryKey: ["ikm-data", year],
		queryFn: () => getIkmData({ data: year }),
	});

	useEffect(() => {
		if (years.length > 0 && !years.includes(year)) {
			setYear(Math.max(...years));
		}
	}, [years, year]);

	const totalAvg =
		ikmData.length > 0
			? ikmData.reduce((sum, d) => sum + d.avgValue, 0) / ikmData.length
			: 0;
	const overall = getMutu(totalAvg);
	const ikmScore = totalAvg * (25 / 4);

	const totalResponden =
		ikmData.length > 0 ? Math.max(...ikmData.map((d) => d.totalResponden)) : 0;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />
			<div className="container mx-auto max-w-4xl flex-1 space-y-6 px-4 py-10">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="mb-2 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--blue)]">
							<span className="h-0.5 w-6 bg-[var(--amber)]" />
							Data Terbuka · Live
						</div>
						<h1 className="text-3xl font-black tracking-tight text-[var(--navy)] md:text-4xl">
							Hasil <span className="text-[var(--blue)]">IKM {year}</span>
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Indeks Kepuasan Masyarakat — Diskominfo Kabupaten Tabalong
						</p>
					</div>
					<Select
						value={String(year)}
						onValueChange={(v) => setYear(Number(v))}
					>
						<SelectTrigger className="min-h-[44px] w-40 rounded-lg border-slate-200 bg-white font-bold text-[var(--navy)]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-lg">
							{years.length > 0 ? (
								years.map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))
							) : (
								<SelectItem value={String(currentYear)}>
									{currentYear}
								</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Overall Card */}
				{ikmData.length > 0 && (
					<Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-2)] text-white shadow-xl">
						<div
							className="pointer-events-none absolute -top-12 -right-12 size-[220px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)",
							}}
							aria-hidden
						/>
						<div
							className="pointer-events-none absolute -bottom-10 -left-10 size-[180px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)",
							}}
							aria-hidden
						/>
						<CardContent className="relative grid items-center gap-6 p-8 sm:grid-cols-[auto_1fr_auto] sm:p-10">
							<div
								className="grid size-24 place-items-center rounded-2xl text-5xl font-black shadow-2xl shadow-amber-500/30 sm:size-28 sm:text-6xl"
								style={{
									background: getMutuFillHex(overall.color),
									color: "#0a1f44",
								}}
							>
								{overall.grade}
							</div>
							<div>
								<div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sky)]">
									Penilaian Keseluruhan
								</div>
								<div className="mt-1 text-2xl font-black sm:text-3xl">
									{overall.label}
								</div>
								<span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold text-[var(--amber)]">
									★ Mutu {overall.grade}
								</span>
							</div>
							<div className="text-left sm:text-right">
								<div className="text-3xl font-black text-[var(--amber)] sm:text-4xl">
									{ikmScore.toFixed(2)}
								</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									IKM Score
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Stat Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--navy)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-slate-100 text-[var(--navy)]">
									<BarChart2 className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Nilai IKM
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{ikmScore.toFixed(2)}
									</div>
								</div>
							</div>
							<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full bg-[var(--navy)] transition-all duration-1000"
									style={{ width: `${Math.min(ikmScore, 100)}%` }}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--amber)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-[var(--amber-soft)] text-amber-800">
									<ClipboardCheck className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Mutu Pelayanan
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{overall.grade}
									</div>
								</div>
							</div>
							<div className="mt-3">
								<Badge
									variant="outline"
									className={`${getMutuBadgeClasses(overall.color)} rounded-full px-3 py-1 text-xs font-bold`}
								>
									{overall.label}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--red)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-red-100 text-[var(--red)]">
									<Users className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Total Responden
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{totalResponden}
									</div>
								</div>
							</div>
							<div className="mt-3">
								<span className="inline-block rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
									{ikmData.length} unsur pelayanan dinilai
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Detail Table */}
				<Card className="overflow-hidden rounded-xl border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between bg-[var(--navy)] p-5 text-white">
						<CardTitle className="text-sm font-extrabold tracking-wide">
							Detail Per Unsur — Tahun {year}
						</CardTitle>
						<span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--amber)]">
							{ikmData.length} ASPEK
						</span>
					</CardHeader>
					<CardContent className="p-0">
						{ikmData.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Kode
											</TableHead>
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Unsur Pelayanan
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Rata-rata
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												NRR × 25/4
											</TableHead>
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Mutu
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Responden
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ikmData.map((d, idx) => {
											const mutu = getMutu(d.avgValue);
											const ikm = d.avgValue * (25 / 4);
											return (
												<TableRow
													key={d.formQuestionId}
													className={
														idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
													}
												>
													<TableCell className="py-3">
														<span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-extrabold text-[var(--blue)]">
															{d.kode}
														</span>
													</TableCell>
													<TableCell className="py-3 text-sm font-medium text-slate-700">
														{d.text}
													</TableCell>
													<TableCell className="py-3 text-right font-mono text-sm font-bold text-[var(--navy)]">
														{d.avgValue.toFixed(2)}
													</TableCell>
													<TableCell className="py-3 text-right font-mono text-sm font-bold text-[var(--navy)]">
														{ikm.toFixed(2)}
													</TableCell>
													<TableCell className="py-3">
														<Badge
															variant="outline"
															className={`${getMutuBadgeClasses(mutu.color)} rounded-full px-2 py-0.5 text-[10px] font-bold`}
														>
															{mutu.grade} — {mutu.label}
														</Badge>
													</TableCell>
													<TableCell className="py-3 text-right text-sm font-medium text-slate-600">
														{d.totalResponden}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="space-y-4 py-20 text-center">
								<div className="mx-auto grid size-20 place-items-center rounded-full bg-slate-100">
									<BarChart2 className="size-10 text-slate-400" />
								</div>
								<div>
									<p className="text-lg font-extrabold text-[var(--navy)]">
										Belum Ada Data
									</p>
									<p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
										Belum ada data survey Indeks Kepuasan Masyarakat untuk tahun{" "}
										{year}.
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Bar Chart */}
				{ikmData.length > 0 && (
					<Card className="overflow-hidden rounded-xl border-slate-200">
						<CardHeader className="border-b border-slate-100 p-5">
							<CardTitle className="text-sm font-extrabold tracking-wide text-[var(--navy)]">
								Grafik Nilai Per Unsur
							</CardTitle>
						</CardHeader>
						<CardContent className="p-5 sm:p-6">
							<div className="space-y-4">
								{ikmData.map((d, idx) => {
									const mutu = getMutu(d.avgValue);
									const pct = (d.avgValue / 4) * 100;
									const barColor = getMutuFillHex(mutu.color);
									return (
										<div key={d.formQuestionId} className="space-y-1.5">
											<div className="flex items-end justify-between gap-3 text-sm">
												<span className="flex-1 truncate font-medium text-slate-700">
													<span className="mr-2 inline-block rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[var(--blue)]">
														{d.kode}
													</span>
													{d.text}
												</span>
												<div className="flex shrink-0 items-center gap-2">
													<span className="font-mono text-sm font-bold text-[var(--navy)]">
														{d.avgValue.toFixed(2)}
													</span>
													<span
														className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
														style={{ backgroundColor: barColor }}
													>
														{pct.toFixed(0)}%
													</span>
												</div>
											</div>
											<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
												<div
													className="h-full rounded-full transition-all duration-1000 ease-out"
													style={{
														width: `${pct}%`,
														backgroundColor: barColor,
														animationDelay: `${idx * 100}ms`,
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			<PublicFooter />
		</div>
	);
}
