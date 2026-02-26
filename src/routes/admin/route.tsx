import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import {
	BarChart3,
	Building2,
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

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="border-b border-sidebar-border px-4 py-3">
					<Link to="/admin" className="flex items-center gap-2">
						<Building2 className="size-5" />
						<span className="font-bold text-lg gradient-text">
							IKM Diskominfo
						</span>
					</Link>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Menu</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems.map((item) => (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton asChild>
											<Link
												to={item.to}
												activeOptions={item.exact ? { exact: true } : undefined}
												activeProps={{
													className:
														"bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg",
												}}
											>
												<item.icon className="size-4" />
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
							<SidebarGroupLabel>Super Admin</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{superAdminItems.map((item) => (
										<SidebarMenuItem key={item.to}>
											<SidebarMenuButton asChild>
												<Link
													to={item.to}
													activeProps={{
														className:
															"bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg",
													}}
												>
													<item.icon className="size-4" />
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
				<SidebarFooter className="border-t p-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="w-full justify-start gap-2">
								<Avatar className="size-7">
									<AvatarFallback className="text-xs">
										{session.user.name?.charAt(0).toUpperCase() ?? "U"}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start text-sm">
									<span className="font-medium">{session.user.name}</span>
									<span className="text-xs text-muted-foreground">
										{session.user.role}
									</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							<DropdownMenuItem asChild>
								<Link to="/admin/profile">
									<UserCircle className="mr-2 size-4" />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								<LogOut className="mr-2 size-4" />
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-14 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<Separator orientation="vertical" className="h-6" />
					<span className="text-sm font-medium">Admin Panel</span>
				</header>
				<main className="flex-1 p-4">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
