import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, ClipboardCheck, Star, Users } from "lucide-react";
import { useState } from "react";
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
			<div className="flex-1 container mx-auto max-w-4xl px-4 py-8 space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold gradient-text">Hasil IKM</h1>
						<p className="text-muted-foreground mt-1 text-sm">
							Indeks Kepuasan Masyarakat — Tahun {year}
						</p>
					</div>
					<Select
						value={String(year)}
						onValueChange={(v) => setYear(Number(v))}
					>
						<SelectTrigger className="w-36 min-h-[44px] font-medium">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
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

				{/* Summary Card */}
				{ikmData.length > 0 && (
					<Card className={`glass-card overflow-hidden border-0 shadow-xl`}>
						<div
							className={`bg-gradient-to-br ${getOverallBgColor(overall.color)} p-6 text-white`}
						>
							<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
								<div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
									<Star className="size-8 text-white fill-white" />
								</div>
								<div className="text-center sm:text-left">
									<p className="text-white/80 text-sm font-medium uppercase tracking-wider">
										Penilaian Keseluruhan
									</p>
									<div className="flex items-center gap-3 mt-1 justify-center sm:justify-start">
										<span className="text-5xl font-bold">{overall.grade}</span>
										<div>
											<p className="text-xl font-semibold">{overall.label}</p>
											<p className="text-white/70 text-sm">
												IKM Score: {ikmScore.toFixed(2)}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				)}

				{/* Stat Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="glass-card border-0 shadow-md overflow-hidden">
						<CardContent className="p-5">
							<div className="flex items-center gap-4">
								<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
									<BarChart2 className="size-6 text-indigo-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-medium">
										Nilai IKM
									</p>
									<p className="text-3xl font-bold text-indigo-700">
										{ikmScore.toFixed(2)}
									</p>
								</div>
							</div>
							<div className="mt-3 h-1 rounded-full bg-indigo-100 overflow-hidden">
								<div
									className="h-full rounded-full bg-indigo-500 transition-all"
									style={{ width: `${Math.min((ikmScore / 100) * 100, 100)}%` }}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="glass-card border-0 shadow-md overflow-hidden">
						<CardContent className="p-5">
							<div className="flex items-center gap-4">
								<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">
									<ClipboardCheck className="size-6 text-violet-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-medium">
										Mutu Pelayanan
									</p>
									<p className="text-3xl font-bold text-violet-700">
										{overall.grade}
									</p>
								</div>
							</div>
							<div className="mt-3">
								<Badge
									variant="outline"
									className={`${getBadgeColor(overall.color)} font-semibold px-3 py-1`}
								>
									{overall.label}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="glass-card border-0 shadow-md overflow-hidden">
						<CardContent className="p-5">
							<div className="flex items-center gap-4">
								<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
									<Users className="size-6 text-emerald-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-medium">
										Total Responden
									</p>
									<p className="text-3xl font-bold text-emerald-700">
										{totalResponden}
									</p>
								</div>
							</div>
							<div className="mt-3">
								<p className="text-xs text-muted-foreground">
									{ikmData.length} unsur pelayanan dinilai
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Data Table */}
				<Card className="glass-card border-0 shadow-md overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-xl">
						<CardTitle className="text-white text-lg">
							Detail Per Unsur — Tahun {year}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{ikmData.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-indigo-50/80 hover:bg-indigo-50/80 border-b border-indigo-100">
											<TableHead className="text-indigo-900 font-semibold">
												Kode
											</TableHead>
											<TableHead className="text-indigo-900 font-semibold">
												Unsur Pelayanan
											</TableHead>
											<TableHead className="text-right text-indigo-900 font-semibold">
												Rata-rata
											</TableHead>
											<TableHead className="text-right text-indigo-900 font-semibold">
												NRR x 25/4
											</TableHead>
											<TableHead className="text-indigo-900 font-semibold">
												Mutu
											</TableHead>
											<TableHead className="text-right text-indigo-900 font-semibold">
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
														idx % 2 === 1 ? "bg-indigo-50/30" : ""
													}`}
												>
													<TableCell className="font-mono text-sm font-medium text-indigo-600">
														{d.kode}
													</TableCell>
													<TableCell className="font-medium">
														{d.text}
													</TableCell>
													<TableCell className="text-right font-mono">
														{d.avgValue.toFixed(2)}
													</TableCell>
													<TableCell className="text-right font-mono">
														{ikm.toFixed(2)}
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={`${getBadgeColor(mutu.color)} font-semibold`}
														>
															{mutu.grade} — {mutu.label}
														</Badge>
													</TableCell>
													<TableCell className="text-right font-medium">
														{d.totalResponden}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="py-16 text-center space-y-4">
								<div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
									<BarChart2 className="size-10 text-muted-foreground/50" />
								</div>
								<div>
									<p className="font-semibold text-muted-foreground">
										Belum Ada Data
									</p>
									<p className="text-sm text-muted-foreground/70 mt-1">
										Belum ada data survey untuk tahun {year}.
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Bar Chart */}
				{ikmData.length > 0 && (
					<Card className="glass-card border-0 shadow-md">
						<CardHeader>
							<CardTitle className="text-lg">Grafik Nilai Per Unsur</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{ikmData.map((d) => {
									const mutu = getMutu(d.avgValue);
									const pct = (d.avgValue / 4) * 100;
									const barColor = getBarColor(mutu.color);
									return (
										<div key={d.formQuestionId} className="space-y-1.5">
											<div className="flex justify-between items-center gap-2 text-sm">
												<span className="font-medium truncate flex-1">
													<span className="text-indigo-600 font-mono mr-1.5">
														{d.kode}
													</span>
													{d.text}
												</span>
												<div className="flex items-center gap-2 shrink-0">
													<span className="font-mono font-bold text-sm">
														{d.avgValue.toFixed(2)}
													</span>
													<span
														className="text-xs font-semibold px-1.5 py-0.5 rounded-md text-white"
														style={{ backgroundColor: barColor }}
													>
														{pct.toFixed(0)}%
													</span>
												</div>
											</div>
											<div className="h-5 w-full rounded-full bg-muted overflow-hidden">
												<div
													className="h-full rounded-full transition-all duration-700"
													style={{
														width: `${pct}%`,
														backgroundColor: barColor,
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
