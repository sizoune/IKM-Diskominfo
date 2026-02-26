import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Shield, ShieldOff } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsers, toggleBanUser, updateUserRole } from "@/server/users";

export const Route = createFileRoute("/admin/users/")({
	component: UsersPage,
});

type UserRow = {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: string | null;
	banned: boolean | null;
	createdAt: Date;
};

function UsersPage() {
	const queryClient = useQueryClient();
	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: () => getUsers(),
	});

	const roleMut = useMutation({
		mutationFn: updateUserRole,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});

	const banMut = useMutation({
		mutationFn: toggleBanUser,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});

	const columns: ColumnDef<UserRow>[] = [
		{ accessorKey: "name", header: "Nama" },
		{ accessorKey: "username", header: "Username" },
		{ accessorKey: "email", header: "Email" },
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => (
				<Badge
					variant={row.original.role === "admin" ? "default" : "secondary"}
				>
					{row.original.role ?? "user"}
				</Badge>
			),
		},
		{
			accessorKey: "banned",
			header: "Status",
			cell: ({ row }) =>
				row.original.banned ? (
					<Badge variant="destructive">Banned</Badge>
				) : (
					<Badge variant="outline">Active</Badge>
				),
		},
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						title={
							row.original.role === "admin" ? "Jadikan User" : "Jadikan Admin"
						}
						onClick={() =>
							roleMut.mutate({
								data: {
									userId: row.original.id,
									role: row.original.role === "admin" ? "user" : "admin",
								},
							})
						}
					>
						{row.original.role === "admin" ? (
							<ShieldOff className="size-4" />
						) : (
							<Shield className="size-4" />
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						title={row.original.banned ? "Unban" : "Ban"}
						onClick={() =>
							banMut.mutate({
								data: {
									userId: row.original.id,
									banned: !row.original.banned,
								},
							})
						}
					>
						<Ban className="size-4" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Users</h1>
			<DataTable
				columns={columns}
				data={users as UserRow[]}
				searchKey="name"
				searchPlaceholder="Cari user..."
			/>
		</div>
	);
}
