import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ClipboardList, FileText, Plus, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/server/dashboard";

export const Route = createFileRoute("/admin/")({
	component: DashboardPage,
});

function DashboardPage() {
	const { data: stats } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: () => getDashboardStats(),
	});

	const today = new Date().toLocaleDateString("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="space-y-8">
			{/* Welcome Area */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 py-8 shadow-lg">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
				<div className="relative z-10">
					<Badge className="mb-3 bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs font-medium">
						Panel Administrasi
					</Badge>
					<h1 className="text-2xl font-bold text-white mb-1">
						Selamat Datang di IKM Diskominfo
					</h1>
					<p className="text-indigo-200 text-sm">{today}</p>
				</div>
				<div className="absolute -right-8 -bottom-8 size-40 rounded-full bg-white/5" />
				<div className="absolute -right-2 -bottom-14 size-28 rounded-full bg-white/5" />
			</div>

			{/* Stat Cards */}
			<div>
				<h2 className="text-base font-semibold text-foreground mb-4">
					Ringkasan Data
				</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard
						title="Total Survey"
						value={stats?.totalSurvey ?? 0}
						icon={<BarChart3 className="size-5 text-white" />}
						accentColor="indigo"
						trend="+12% bulan ini"
					/>
					<StatCard
						title="Total Tamu"
						value={stats?.totalTamu ?? 0}
						icon={<Users2 className="size-5 text-white" />}
						accentColor="violet"
						trend="+8% bulan ini"
					/>
					<StatCard
						title="Total Layanan"
						value={stats?.totalLayanan ?? 0}
						icon={<ClipboardList className="size-5 text-white" />}
						accentColor="emerald"
						trend="Aktif tersedia"
					/>
				</div>
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="text-base font-semibold text-foreground mb-4">
					Aksi Cepat
				</h2>
				<div className="grid gap-3 sm:grid-cols-3">
					<Button
						asChild
						variant="outline"
						className="h-auto flex-col gap-2 py-4 rounded-xl border-dashed hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all duration-200 group"
					>
						<Link to="/admin/forms">
							<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
								<Plus className="size-5" />
							</div>
							<div className="text-center">
								<p className="text-sm font-semibold">Form Baru</p>
								<p className="text-xs text-muted-foreground">
									Buat form survey
								</p>
							</div>
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="h-auto flex-col gap-2 py-4 rounded-xl border-dashed hover:border-violet-400 hover:bg-violet-50/50 hover:text-violet-700 transition-all duration-200 group"
					>
						<Link to="/admin/survey">
							<div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-200 transition-colors">
								<BarChart3 className="size-5" />
							</div>
							<div className="text-center">
								<p className="text-sm font-semibold">Lihat Survey</p>
								<p className="text-xs text-muted-foreground">
									Data hasil survey
								</p>
							</div>
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="h-auto flex-col gap-2 py-4 rounded-xl border-dashed hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all duration-200 group"
					>
						<Link to="/admin/layanan">
							<div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
								<FileText className="size-5" />
							</div>
							<div className="text-center">
								<p className="text-sm font-semibold">Kelola Layanan</p>
								<p className="text-xs text-muted-foreground">
									Atur layanan aktif
								</p>
							</div>
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

const accentStyles: Record<
	string,
	{ border: string; iconBg: string; badge: string; badgeText: string }
> = {
	indigo: {
		border: "border-l-indigo-500",
		iconBg: "from-indigo-500 to-indigo-600",
		badge: "bg-indigo-50 text-indigo-600",
		badgeText: "text-indigo-600",
	},
	violet: {
		border: "border-l-violet-500",
		iconBg: "from-violet-500 to-violet-600",
		badge: "bg-violet-50 text-violet-600",
		badgeText: "text-violet-600",
	},
	emerald: {
		border: "border-l-emerald-500",
		iconBg: "from-emerald-500 to-emerald-600",
		badge: "bg-emerald-50 text-emerald-600",
		badgeText: "text-emerald-600",
	},
};

function StatCard({
	title,
	value,
	icon,
	accentColor,
	trend,
}: {
	title: string;
	value: number;
	icon: React.ReactNode;
	accentColor: "indigo" | "violet" | "emerald";
	trend?: string;
}) {
	const styles = accentStyles[accentColor];

	return (
		<Card
			className={`border-l-4 ${styles.border} backdrop-blur bg-white/70 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative`}
		>
			<div className="absolute -right-4 -top-4 size-24 rounded-full bg-gradient-to-br opacity-5 from-gray-900 to-gray-700" />
			<CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<div
					className={`relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${styles.iconBg} shadow-md`}
				>
					{icon}
				</div>
			</CardHeader>
			<CardContent className="px-5 pb-5">
				<div className="text-3xl font-bold text-foreground">{value}</div>
				{trend && (
					<p className={`text-xs mt-1 font-medium ${styles.badgeText}`}>
						{trend}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
