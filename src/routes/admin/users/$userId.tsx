import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Ban, Shield, ShieldOff } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getUserById, toggleBanUser, updateUserRole } from "@/server/users";

export const Route = createFileRoute("/admin/users/$userId")({
	component: UserDetailPage,
});

function UserDetailPage() {
	const { userId } = Route.useParams();
	const queryClient = useQueryClient();
	const roleFieldId = useId();
	const statusFieldId = useId();

	const { data: user, isLoading } = useQuery({
		queryKey: ["users", userId],
		queryFn: () => getUserById({ data: userId }),
	});

	const roleMut = useMutation({
		mutationFn: updateUserRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users", userId] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const banMut = useMutation({
		mutationFn: toggleBanUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users", userId] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Link
					to="/admin/users"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Kembali ke Users
				</Link>
				<p>Memuat...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="space-y-4">
				<Link
					to="/admin/users"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Kembali ke Users
				</Link>
				<p>User tidak ditemukan.</p>
			</div>
		);
	}

	const isAdmin = user.role === "admin";
	const isBanned = !!user.banned;

	return (
		<div className="space-y-4">
			<Link
				to="/admin/users"
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Kembali ke Users
			</Link>

			<h1 className="text-2xl font-bold">Detail User</h1>

			<Card>
				<CardHeader>
					<CardTitle>{user.name}</CardTitle>
					<CardDescription>{user.email}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor={roleFieldId}
								className="text-sm font-medium text-muted-foreground"
							>
								Username
							</label>
							<p id={roleFieldId}>{user.username ?? "-"}</p>
						</div>
						<div>
							<label
								htmlFor={statusFieldId}
								className="text-sm font-medium text-muted-foreground"
							>
								Dibuat pada
							</label>
							<p id={statusFieldId}>
								{new Date(user.createdAt).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</p>
						</div>
						<div>
							<span className="text-sm font-medium text-muted-foreground">
								Role
							</span>
							<div className="mt-1">
								<Badge variant={isAdmin ? "default" : "secondary"}>
									{user.role ?? "user"}
								</Badge>
							</div>
						</div>
						<div>
							<span className="text-sm font-medium text-muted-foreground">
								Status
							</span>
							<div className="mt-1">
								{isBanned ? (
									<Badge variant="destructive">Banned</Badge>
								) : (
									<Badge variant="outline">Active</Badge>
								)}
							</div>
						</div>
					</div>

					<div className="flex gap-2 pt-4 border-t">
						<Button
							variant={isAdmin ? "outline" : "default"}
							onClick={() =>
								roleMut.mutate({
									data: {
										userId: user.id,
										role: isAdmin ? "user" : "admin",
									},
								})
							}
							disabled={roleMut.isPending}
						>
							{isAdmin ? (
								<>
									<ShieldOff className="size-4" />
									Jadikan User
								</>
							) : (
								<>
									<Shield className="size-4" />
									Jadikan Admin
								</>
							)}
						</Button>
						<Button
							variant={isBanned ? "outline" : "destructive"}
							onClick={() =>
								banMut.mutate({
									data: {
										userId: user.id,
										banned: !isBanned,
									},
								})
							}
							disabled={banMut.isPending}
						>
							<Ban className="size-4" />
							{isBanned ? "Unban User" : "Ban User"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
