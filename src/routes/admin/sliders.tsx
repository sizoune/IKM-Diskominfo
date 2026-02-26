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
	createSlider,
	deleteSlider,
	getSliders,
	updateSlider,
} from "@/server/sliders";

export const Route = createFileRoute("/admin/sliders")({
	component: SlidersPage,
});

type SliderRow = {
	sliderId: number;
	sliderTitle: string | null;
	sliderDesc: string | null;
	sliderActive: number | null;
	sliderImage: string | null;
};

function SlidersPage() {
	const queryClient = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["sliders"],
		queryFn: () => getSliders(),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<SliderRow | null>(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [active, setActive] = useState(1);
	const [image, setImage] = useState("");

	const createMut = useMutation({
		mutationFn: createSlider,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sliders"] });
			resetDialog();
		},
	});

	const updateMut = useMutation({
		mutationFn: updateSlider,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sliders"] });
			resetDialog();
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteSlider,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sliders"] });
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setTitle("");
		setDesc("");
		setActive(1);
		setImage("");
	}

	function openEdit(item: SliderRow) {
		setEditing(item);
		setTitle(item.sliderTitle ?? "");
		setDesc(item.sliderDesc ?? "");
		setActive(item.sliderActive ?? 1);
		setImage(item.sliderImage ?? "");
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const data = {
			sliderTitle: title,
			sliderDesc: desc,
			sliderActive: active,
			sliderImage: image,
		};
		if (editing) {
			updateMut.mutate({
				data: { sliderId: editing.sliderId, ...data },
			});
		} else {
			createMut.mutate({ data });
		}
	}

	const columns: ColumnDef<SliderRow>[] = [
		{ accessorKey: "sliderId", header: "ID" },
		{ accessorKey: "sliderTitle", header: "Judul" },
		{
			accessorKey: "sliderActive",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.sliderActive ? "default" : "secondary"}>
					{row.original.sliderActive ? "Aktif" : "Nonaktif"}
				</Badge>
			),
		},
		{
			accessorKey: "sliderImage",
			header: "Gambar",
			cell: ({ row }) =>
				row.original.sliderImage ? (
					<span className="text-xs truncate max-w-[200px] block">
						{row.original.sliderImage}
					</span>
				) : (
					"-"
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
								data: row.original.sliderId,
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
				<h1 className="text-2xl font-bold">Slider</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Slider
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit Slider" : "Tambah Slider"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Judul</Label>
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label>Deskripsi</Label>
								<textarea
									className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
									value={desc}
									onChange={(e) => setDesc(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label>URL Gambar</Label>
								<Input
									value={image}
									onChange={(e) => setImage(e.target.value)}
									placeholder="/images/slider.jpg"
								/>
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
				data={items as SliderRow[]}
				searchKey="sliderTitle"
				searchPlaceholder="Cari slider..."
			/>
		</div>
	);
}
