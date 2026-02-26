import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ClipboardList, Users2 } from "lucide-react";
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

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold gradient-text inline-block">
					Dashboard
				</h1>
				<p className="text-sm text-muted-foreground">
					Selamat datang di panel administrasi IKM
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					title="Total Survey"
					value={stats?.totalSurvey ?? 0}
					icon={<BarChart3 className="size-5 text-white" />}
				/>
				<StatCard
					title="Total Tamu"
					value={stats?.totalTamu ?? 0}
					icon={<Users2 className="size-5 text-white" />}
				/>
				<StatCard
					title="Total Layanan"
					value={stats?.totalLayanan ?? 0}
					icon={<ClipboardList className="size-5 text-white" />}
				/>
			</div>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon,
}: {
	title: string;
	value: number;
	icon: React.ReactNode;
}) {
	return (
		<Card className="border-l-4 border-l-indigo-500 backdrop-blur bg-white/70 hover:shadow-lg transition-all duration-200">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}
