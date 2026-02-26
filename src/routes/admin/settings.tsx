import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSettings, updateSetting } from "@/server/settings";

export const Route = createFileRoute("/admin/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const queryClient = useQueryClient();
	const { data: settings = [] } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings(),
	});

	const [values, setValues] = useState<Record<number, string>>({});

	useEffect(() => {
		const initial: Record<number, string> = {};
		for (const s of settings) {
			initial[s.settingId] = s.settingValue ?? "";
		}
		setValues(initial);
	}, [settings]);

	const updateMut = useMutation({
		mutationFn: updateSetting,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
	});

	function handleSave(settingId: number) {
		updateMut.mutate({
			data: { settingId, settingValue: values[settingId] ?? "" },
		});
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Settings</h1>
			<div className="grid gap-4">
				{settings.map((s) => (
					<Card key={s.settingId}>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">{s.settingName}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2">
								{s.settingInput === "textarea" ? (
									<textarea
										className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
										value={values[s.settingId] ?? ""}
										onChange={(e) =>
											setValues((prev) => ({
												...prev,
												[s.settingId]: e.target.value,
											}))
										}
									/>
								) : (
									<Input
										type={s.settingInput === "number" ? "number" : "text"}
										value={values[s.settingId] ?? ""}
										onChange={(e) =>
											setValues((prev) => ({
												...prev,
												[s.settingId]: e.target.value,
											}))
										}
									/>
								)}
								<Button
									size="icon"
									onClick={() => handleSave(s.settingId)}
									disabled={updateMut.isPending}
								>
									<Save className="size-4" />
								</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Key: {s.settingKey}
							</p>
						</CardContent>
					</Card>
				))}
				{settings.length === 0 && (
					<p className="text-center text-muted-foreground py-8">
						Belum ada pengaturan.
					</p>
				)}
			</div>
		</div>
	);
}
