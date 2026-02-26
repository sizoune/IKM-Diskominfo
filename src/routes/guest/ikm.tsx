import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, ClipboardCheck, Star, Users } from "lucide-react";
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
import { getMutu } from "@/lib/ikm";
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

function getBadgeColor(color: string) {
	switch (color) {
		case "green":
			return "bg-emerald-100 text-emerald-800 border-emerald-300";
		case "blue":
			return "bg-indigo-100 text-indigo-800 border-indigo-300";
		case "yellow":
			return "bg-amber-100 text-amber-800 border-amber-300";
		default:
			return "bg-red-100 text-red-800 border-red-300";
	}
}

function getBarColor(color: string) {
	switch (color) {
		case "green":
			return "#10B981";
		case "blue":
			return "#6366F1";
		case "yellow":
			return "#F59E0B";
		default:
			return "#EF4444";
	}
}

function getOverallBgColor(color: string) {
	switch (color) {
		case "green":
			return "from-emerald-500 to-teal-500";
		case "blue":
			return "from-indigo-500 to-violet-500";
		case "yellow":
			return "from-amber-500 to-orange-400";
		default:
			return "from-red-500 to-rose-500";
	}
}

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

	// Fix year bug: set to latest available year when data loads
	useEffect(() => {
		if (years.length > 0 && !years.includes(year)) {
			setYear(Math.max(...years));
		}
	}, [years, year]);

	// Calculate overall IKM
	const totalAvg =
		ikmData.length > 0
			? ikmData.reduce((sum, d) => sum + d.avgValue, 0) / ikmData.length
			: 0;
	const overall = getMutu(totalAvg);
	const ikmScore = totalAvg * (25 / 4);

	const totalResponden =
		ikmData.length > 0 ? Math.max(...ikmData.map((d) => d.totalResponden)) : 0;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />
			<div className="flex-1 container mx-auto max-w-4xl px-4 py-10 space-y-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
					<div className="space-y-1">
						<h1 className="text-4xl font-extrabold tracking-tight gradient-text">Hasil IKM</h1>
						<p className="text-muted-foreground text-base">
							Indeks Kepuasan Masyarakat — Tahun {year}
						</p>
					</div>
					<Select
						value={String(year)}
						onValueChange={(v) => setYear(Number(v))}
					>
						<SelectTrigger className="w-40 min-h-[44px] font-medium rounded-xl bg-white/50 backdrop-blur-sm border-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							{years.length > 0 ? (
								years.map((y) => (
									<SelectItem key={y} value={String(y)} className="rounded-lg">
										{y}
									</SelectItem>
								))
							) : (
								<SelectItem value={String(currentYear)} className="rounded-lg">
									{currentYear}
								</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Summary Card */}
				{ikmData.length > 0 && (
					<Card className="glass-card overflow-hidden border-0 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
						<div
							className={`bg-gradient-to-br ${getOverallBgColor(overall.color)} p-8 sm:p-10 text-white relative overflow-hidden`}
						>
							{/* Decorative background elements */}
							<div className="absolute top-0 right-0 -mt-16 -mr-16 size-64 bg-white/10 rounded-full blur-3xl"></div>
							<div className="absolute bottom-0 left-0 -mb-16 -ml-16 size-48 bg-black/10 rounded-full blur-2xl"></div>
							
							<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
								<div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner border border-white/20">
									<Star className="size-10 text-white fill-white drop-shadow-md" />
								</div>
								<div className="text-center sm:text-left space-y-2">
									<p className="text-white/90 text-sm font-semibold uppercase tracking-widest">
										Penilaian Keseluruhan
									</p>
									<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2 justify-center sm:justify-start">
										<span className="text-7xl font-black tracking-tighter drop-shadow-lg">{overall.grade}</span>
										<div className="space-y-1">
											<p className="text-2xl font-bold tracking-tight">{overall.label}</p>
											<div className="inline-flex items-center px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
												<p className="text-white/90 text-sm font-medium">
													IKM Score: <span className="font-mono font-bold ml-1">{ikmScore.toFixed(2)}</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				)}

				{/* Stat Cards */}
				<div className="grid gap-6 md:grid-cols-3">
					<Card className="glass-card border-0 shadow-lg overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<CardContent className="p-6">
							<div className="flex items-center gap-5">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
									<BarChart2 className="size-7" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground font-medium tracking-wide">
										Nilai IKM
									</p>
									<p className="text-4xl font-extrabold text-indigo-950 tracking-tight">
										{ikmScore.toFixed(2)}
									</p>
								</div>
							</div>
							<div className="mt-5 h-2 rounded-full bg-indigo-50 overflow-hidden">
								<div
									className="h-full rounded-full bg-indigo-500 transition-all duration-1000 ease-out"
									style={{ width: `${Math.min((ikmScore / 100) * 100, 100)}%` }}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="glass-card border-0 shadow-lg overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<CardContent className="p-6">
							<div className="flex items-center gap-5">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300 shadow-sm">
									<ClipboardCheck className="size-7" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground font-medium tracking-wide">
										Mutu Pelayanan
									</p>
									<p className="text-4xl font-extrabold text-violet-950 tracking-tight">
										{overall.grade}
									</p>
								</div>
							</div>
							<div className="mt-5">
								<Badge
									variant="outline"
									className={`${getBadgeColor(overall.color)} font-bold px-4 py-1.5 rounded-full text-sm shadow-sm`}
								>
									{overall.label}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="glass-card border-0 shadow-lg overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<CardContent className="p-6">
							<div className="flex items-center gap-5">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
									<Users className="size-7" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground font-medium tracking-wide">
										Total Responden
									</p>
									<p className="text-4xl font-extrabold text-emerald-950 tracking-tight">
										{totalResponden}
									</p>
								</div>
							</div>
							<div className="mt-5">
								<div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
									{ikmData.length} unsur pelayanan dinilai
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Data Table */}
				<Card className="glass-card border-0 shadow-lg overflow-hidden rounded-2xl">
					<CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
						<CardTitle className="text-white text-xl font-bold tracking-wide">
							Detail Per Unsur — Tahun {year}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{ikmData.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-indigo-50/80 hover:bg-indigo-50/80 border-b border-indigo-100">
											<TableHead className="text-indigo-950 font-bold py-4">
												Kode
											</TableHead>
											<TableHead className="text-indigo-950 font-bold py-4">
												Unsur Pelayanan
											</TableHead>
											<TableHead className="text-right text-indigo-950 font-bold py-4">
												Rata-rata
											</TableHead>
											<TableHead className="text-right text-indigo-950 font-bold py-4">
												NRR x 25/4
											</TableHead>
											<TableHead className="text-indigo-950 font-bold py-4">
												Mutu
											</TableHead>
											<TableHead className="text-right text-indigo-950 font-bold py-4">
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
													className={`transition-colors hover:bg-indigo-50/60 ${
														idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
													}`}
												>
													<TableCell className="font-mono text-sm font-bold text-indigo-600 py-4">
														{d.kode}
													</TableCell>
													<TableCell className="font-medium text-slate-700 py-4">
														{d.text}
													</TableCell>
													<TableCell className="text-right font-mono font-medium text-slate-600 py-4">
														{d.avgValue.toFixed(2)}
													</TableCell>
													<TableCell className="text-right font-mono font-medium text-slate-600 py-4">
														{ikm.toFixed(2)}
													</TableCell>
													<TableCell className="py-4">
														<Badge
															variant="outline"
															className={`${getBadgeColor(mutu.color)} font-bold rounded-full px-3`}
														>
															{mutu.grade} — {mutu.label}
														</Badge>
													</TableCell>
													<TableCell className="text-right font-medium text-slate-600 py-4">
														{d.totalResponden}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="py-24 text-center space-y-5">
								<div className="mx-auto flex size-24 items-center justify-center rounded-full bg-slate-100 shadow-inner">
									<BarChart2 className="size-12 text-slate-400" />
								</div>
								<div className="space-y-2">
									<p className="text-xl font-bold text-slate-700">
										Belum Ada Data
									</p>
									<p className="text-base text-slate-500 max-w-sm mx-auto">
										Belum ada data survey Indeks Kepuasan Masyarakat untuk tahun {year}.
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Bar Chart */}
				{ikmData.length > 0 && (
					<Card className="glass-card border-0 shadow-lg rounded-2xl overflow-hidden">
						<CardHeader className="border-b border-slate-100 bg-white/50 p-6">
							<CardTitle className="text-xl font-bold text-slate-800 tracking-wide">Grafik Nilai Per Unsur</CardTitle>
						</CardHeader>
						<CardContent className="p-6 sm:p-8">
							<div className="space-y-6">
								{ikmData.map((d, idx) => {
									const mutu = getMutu(d.avgValue);
									const pct = (d.avgValue / 4) * 100;
									const barColor = getBarColor(mutu.color);
									return (
										<div key={d.formQuestionId} className="space-y-2 group">
											<div className="flex justify-between items-end gap-4 text-sm">
												<span className="font-medium text-slate-700 truncate flex-1 group-hover:text-indigo-700 transition-colors">
													<span className="text-indigo-600 font-mono font-bold mr-2 bg-indigo-50 px-2 py-0.5 rounded">
														{d.kode}
													</span>
													{d.text}
												</span>
												<div className="flex items-center gap-3 shrink-0">
													<span className="font-mono font-bold text-base text-slate-700">
														{d.avgValue.toFixed(2)}
													</span>
													<span
														className="text-xs font-bold px-2 py-1 rounded-md text-white shadow-sm"
														style={{ backgroundColor: barColor }}
													>
														{pct.toFixed(0)}%
													</span>
												</div>
											</div>
											<div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
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
