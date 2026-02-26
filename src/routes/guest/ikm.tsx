import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />
			<div className="flex-1 container mx-auto max-w-4xl px-4 py-8 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold gradient-text">Hasil IKM</h1>
					<Select
						value={String(year)}
						onValueChange={(v) => setYear(Number(v))}
					>
						<SelectTrigger className="w-32">
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

				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-l-4 border-l-indigo-500 glass-card">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Nilai IKM</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{ikmScore.toFixed(2)}</div>
						</CardContent>
					</Card>
					<Card className="border-l-4 border-l-violet-500 glass-card">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Mutu Pelayanan
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{overall.grade}</div>
							<Badge variant="outline" className={getBadgeColor(overall.color)}>
								{overall.label}
							</Badge>
						</CardContent>
					</Card>
					<Card className="border-l-4 border-l-emerald-500 glass-card">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Unsur</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{ikmData.length}</div>
						</CardContent>
					</Card>
				</div>

				<Card className="glass-card">
					<CardHeader>
						<CardTitle>Detail Per Unsur — Tahun {year}</CardTitle>
					</CardHeader>
					<CardContent>
						{ikmData.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-600">
											<TableHead className="text-white">Kode</TableHead>
											<TableHead className="text-white">
												Unsur Pelayanan
											</TableHead>
											<TableHead className="text-right text-white">
												Rata-rata
											</TableHead>
											<TableHead className="text-right text-white">
												NRR x 25/4
											</TableHead>
											<TableHead className="text-white">Mutu</TableHead>
											<TableHead className="text-right text-white">
												Responden
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ikmData.map((d) => {
											const mutu = getMutu(d.avgValue);
											const ikm = d.avgValue * (25 / 4);
											return (
												<TableRow
													key={d.formQuestionId}
													className="even:bg-indigo-50/50"
												>
													<TableCell className="font-mono">{d.kode}</TableCell>
													<TableCell>{d.text}</TableCell>
													<TableCell className="text-right">
														{d.avgValue.toFixed(2)}
													</TableCell>
													<TableCell className="text-right">
														{ikm.toFixed(2)}
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className={getBadgeColor(mutu.color)}
														>
															{mutu.grade} - {mutu.label}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														{d.totalResponden}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<p className="text-center text-muted-foreground py-8">
								Belum ada data survey untuk tahun {year}.
							</p>
						)}
					</CardContent>
				</Card>

				{ikmData.length > 0 && (
					<Card className="glass-card">
						<CardHeader>
							<CardTitle>Grafik Nilai Per Unsur</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{ikmData.map((d) => {
									const mutu = getMutu(d.avgValue);
									const pct = (d.avgValue / 4) * 100;
									return (
										<div key={d.formQuestionId} className="space-y-1">
											<div className="flex justify-between text-sm">
												<span>
													{d.kode} - {d.text}
												</span>
												<span className="font-mono">
													{d.avgValue.toFixed(2)}
												</span>
											</div>
											<div className="h-4 w-full rounded-full bg-muted overflow-hidden">
												<div
													className="h-full rounded-full transition-all"
													style={{
														width: `${pct}%`,
														backgroundColor: getBarColor(mutu.color),
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
