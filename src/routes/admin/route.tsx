import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import {
	BarChart3,
	ClipboardList,
	FileText,
	Image,
	LayoutDashboard,
	LogOut,
	Settings,
	UserCircle,
	Users,
	Users2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin")({
	beforeLoad: async () => {
		const session = await requireAuth();
		return { session };
	},
	component: AdminLayout,
});

const navItems = [
	{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
	{ to: "/admin/forms", label: "Forms", icon: FileText },
	{ to: "/admin/layanan", label: "Layanan", icon: ClipboardList },
	{ to: "/admin/tamu", label: "Tamu", icon: Users2 },
	{ to: "/admin/survey", label: "Survey", icon: BarChart3 },
	{ to: "/admin/sliders", label: "Slider", icon: Image },
];

const superAdminItems = [
	{ to: "/admin/settings", label: "Settings", icon: Settings },
	{ to: "/admin/users", label: "Users", icon: Users },
];

function AdminLayout() {
	const { session } = Route.useRouteContext();
	const navigate = useNavigate();
	const userRole = session.user.role;
	const isSuperAdmin = userRole === "admin";

	async function handleSignOut() {
		await authClient.signOut();
		navigate({ to: "/login" });
	}

	const roleLabel = isSuperAdmin ? "Super Admin" : "Admin";

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="px-4 py-4">
					<Link to="/admin" className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1 ring-1 ring-white/20">
							<img
								src="/komdigi.png"
								alt="Logo Komdigi"
								className="size-7 object-contain"
							/>
						</div>
						<span className="font-bold text-lg gradient-text leading-tight">
							IKM Diskominfo
						</span>
					</Link>
					<Separator className="mt-3 bg-white/10" />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest opacity-50 px-3">
							Menu
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems.map((item) => (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton asChild>
											<Link
												to={item.to}
												activeOptions={item.exact ? { exact: true } : undefined}
												className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent"
												activeProps={{
													className:
														"bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg border-l-2 border-white/30 shadow-md",
												}}
											>
												<item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					{isSuperAdmin && (
						<SidebarGroup>
							<SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest opacity-50 px-3">
								Super Admin
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{superAdminItems.map((item) => (
										<SidebarMenuItem key={item.to}>
											<SidebarMenuButton asChild>
												<Link
													to={item.to}
													className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent"
													activeProps={{
														className:
															"bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg border-l-2 border-white/30 shadow-md",
													}}
												>
													<item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
													<span>{item.label}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					)}
				</SidebarContent>
				<SidebarFooter className="border-t border-white/10 p-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="w-full justify-start gap-3 rounded-xl px-3 py-2 h-auto hover:bg-sidebar-accent transition-all duration-200"
							>
								<div className="relative shrink-0">
									<Avatar className="size-8 ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-transparent">
										<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">
											{session.user.name?.charAt(0).toUpperCase() ?? "U"}
										</AvatarFallback>
									</Avatar>
									<span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-400" />
								</div>
								<div className="flex flex-col items-start min-w-0">
									<span className="font-semibold text-sm truncate max-w-[120px]">
										{session.user.name}
									</span>
									<Badge
										variant="secondary"
										className="mt-0.5 h-4 rounded-sm px-1.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
									>
										{roleLabel}
									</Badge>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-52 rounded-xl shadow-xl"
						>
							<DropdownMenuItem asChild className="rounded-lg cursor-pointer">
								<Link to="/admin/profile" className="flex items-center gap-2">
									<UserCircle className="size-4 text-muted-foreground" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleSignOut}
								className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
							>
								<LogOut className="mr-2 size-4" />
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 sticky top-0 z-10">
					<SidebarTrigger className="rounded-lg" />
					<Separator orientation="vertical" className="h-5" />
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-foreground">
							Admin Panel
						</span>
						<span className="text-muted-foreground text-sm">
							/ IKM Diskominfo
						</span>
					</div>
				</header>
				<main className="flex-1 p-6">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
