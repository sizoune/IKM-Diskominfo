import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	createLayanan,
	deleteLayanan,
	getLayanan,
	updateLayanan,
} from "@/server/layanan";

export const Route = createFileRoute("/admin/layanan")({
	component: LayananPage,
});

type LayananRow = {
	layananId: number;
	nama: string | null;
	tipe: string | null;
	active: number | null;
};

function LayananPage() {
	const queryClient = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["layanan"],
		queryFn: () => getLayanan(),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<LayananRow | null>(null);
	const [nama, setNama] = useState("");
	const [tipe, setTipe] = useState("offline");
	const [active, setActive] = useState(1);

	const createMut = useMutation({
		mutationFn: createLayanan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["layanan"] });
			resetDialog();
		},
	});

	const updateMut = useMutation({
		mutationFn: updateLayanan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["layanan"] });
			resetDialog();
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteLayanan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["layanan"] });
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setNama("");
		setTipe("offline");
		setActive(1);
	}

	function openEdit(item: LayananRow) {
		setEditing(item);
		setNama(item.nama ?? "");
		setTipe(item.tipe ?? "offline");
		setActive(item.active ?? 1);
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (editing) {
			updateMut.mutate({
				data: { layananId: editing.layananId, nama, tipe, active },
			});
		} else {
			createMut.mutate({ data: { nama, tipe, active } });
		}
	}

	const columns: ColumnDef<LayananRow>[] = [
		{ accessorKey: "layananId", header: "ID" },
		{ accessorKey: "nama", header: "Nama" },
		{
			accessorKey: "tipe",
			header: "Tipe",
			cell: ({ row }) => <Badge variant="outline">{row.original.tipe}</Badge>,
		},
		{
			accessorKey: "active",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.active ? "default" : "secondary"}>
					{row.original.active ? "Aktif" : "Nonaktif"}
				</Badge>
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
						onClick={() => openEdit(row.original)}
					>
						<Pencil className="size-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							deleteMut.mutate({
								data: row.original.layananId,
							})
						}
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Layanan</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Layanan
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit Layanan" : "Tambah Layanan"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Nama</Label>
								<Input
									value={nama}
									onChange={(e) => setNama(e.target.value)}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Tipe</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={tipe}
										onChange={(e) => setTipe(e.target.value)}
									>
										<option value="offline">Offline</option>
										<option value="online">Online</option>
									</select>
								</div>
								<div className="space-y-2">
									<Label>Aktif</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={active}
										onChange={(e) => setActive(Number(e.target.value))}
									>
										<option value={1}>Aktif</option>
										<option value={0}>Nonaktif</option>
									</select>
								</div>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={createMut.isPending || updateMut.isPending}
							>
								{editing ? "Simpan" : "Tambah"}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={items as LayananRow[]}
				searchKey="nama"
				searchPlaceholder="Cari layanan..."
			/>
		</div>
	);
}
