import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
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
import { JK, PEKERJAAN, PENDIDIKAN, STATUS } from "@/lib/constants";
import { createTamu, deleteTamu, getTamu, updateTamu } from "@/server/tamu";

export const Route = createFileRoute("/admin/tamu")({
	component: TamuPage,
});

type TamuRow = {
	tamuId: number;
	nama: string | null;
	nip: string | null;
	jk: string | null;
	umur: number | null;
	pendidikan: string | null;
	pekerjaan: string | null;
	status: string | null;
};

function TamuPage() {
	const queryClient = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["tamu"],
		queryFn: () => getTamu(),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<TamuRow | null>(null);
	const [nama, setNama] = useState("");
	const [nip, setNip] = useState("");
	const [jk, setJk] = useState("L");
	const [umur, setUmur] = useState(0);
	const [pendidikan, setPendidikan] = useState("");
	const [pekerjaan, setPekerjaan] = useState("");
	const [status, setStatus] = useState("NON_ASN");

	const createMut = useMutation({
		mutationFn: createTamu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tamu"] });
			resetDialog();
		},
	});

	const updateMut = useMutation({
		mutationFn: updateTamu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tamu"] });
			resetDialog();
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteTamu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tamu"] });
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setNama("");
		setNip("");
		setJk("L");
		setUmur(0);
		setPendidikan("");
		setPekerjaan("");
		setStatus("NON_ASN");
	}

	function openEdit(item: TamuRow) {
		setEditing(item);
		setNama(item.nama ?? "");
		setNip(item.nip ?? "");
		setJk(item.jk ?? "L");
		setUmur(item.umur ?? 0);
		setPendidikan(item.pendidikan ?? "");
		setPekerjaan(item.pekerjaan ?? "");
		setStatus(item.status ?? "NON_ASN");
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const data = {
			nama,
			nip: nip || undefined,
			jk,
			umur,
			pendidikan,
			pekerjaan,
			status,
		};
		if (editing) {
			updateMut.mutate({ data: { tamuId: editing.tamuId, ...data } });
		} else {
			createMut.mutate({ data });
		}
	}

	const columns: ColumnDef<TamuRow>[] = [
		{ accessorKey: "tamuId", header: "ID" },
		{ accessorKey: "nama", header: "Nama" },
		{ accessorKey: "nip", header: "NIP" },
		{
			accessorKey: "jk",
			header: "JK",
			cell: ({ row }) =>
				JK[row.original.jk as keyof typeof JK] ?? row.original.jk,
		},
		{ accessorKey: "umur", header: "Umur" },
		{ accessorKey: "pendidikan", header: "Pendidikan" },
		{ accessorKey: "pekerjaan", header: "Pekerjaan" },
		{ accessorKey: "status", header: "Status" },
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
								data: row.original.tamuId,
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
				<h1 className="text-2xl font-bold">Tamu</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Tamu
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editing ? "Edit Tamu" : "Tambah Tamu"}</DialogTitle>
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
									<Label>NIP</Label>
									<Input value={nip} onChange={(e) => setNip(e.target.value)} />
								</div>
								<div className="space-y-2">
									<Label>JK</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={jk}
										onChange={(e) => setJk(e.target.value)}
									>
										{Object.entries(JK).map(([k, v]) => (
											<option key={k} value={k}>
												{v}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Umur</Label>
									<Input
										type="number"
										value={umur}
										onChange={(e) => setUmur(Number(e.target.value))}
									/>
								</div>
								<div className="space-y-2">
									<Label>Status</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={status}
										onChange={(e) => setStatus(e.target.value)}
									>
										{Object.entries(STATUS).map(([k, v]) => (
											<option key={k} value={k}>
												{v}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Pendidikan</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={pendidikan}
										onChange={(e) => setPendidikan(e.target.value)}
									>
										<option value="">-</option>
										{Object.entries(PENDIDIKAN).map(([k, v]) => (
											<option key={k} value={k}>
												{v}
											</option>
										))}
									</select>
								</div>
								<div className="space-y-2">
									<Label>Pekerjaan</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={pekerjaan}
										onChange={(e) => setPekerjaan(e.target.value)}
									>
										<option value="">-</option>
										{Object.entries(PEKERJAAN).map(([k, v]) => (
											<option key={k} value={k}>
												{v}
											</option>
										))}
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
				data={items as TamuRow[]}
				searchKey="nama"
				searchPlaceholder="Cari tamu..."
			/>
		</div>
	);
}
