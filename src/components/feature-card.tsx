import type { ReactNode } from "react";

type Accent = "navy" | "red" | "amber";

type FeatureCardProps = {
	accent: Accent;
	icon: ReactNode;
	title: string;
	description: string;
};

const stripColor: Record<Accent, string> = {
	navy: "var(--navy)",
	red: "var(--red)",
	amber: "var(--amber)",
};

const iconBg: Record<Accent, string> = {
	navy: "bg-slate-100 text-[var(--navy)]",
	red: "bg-red-100 text-[var(--red)]",
	amber: "bg-[var(--amber-soft)] text-amber-800",
};

export function FeatureCard({
	accent,
	icon,
	title,
	description,
}: FeatureCardProps) {
	return (
		<div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
			<div
				className="absolute inset-y-0 left-0 w-[3px]"
				style={{ background: stripColor[accent] }}
				aria-hidden
			/>
			<div
				className={`mb-4 grid size-11 place-items-center rounded-lg text-xl font-black ${iconBg[accent]}`}
			>
				{icon}
			</div>
			<h3 className="mb-2 text-base font-extrabold text-[var(--navy)]">
				{title}
			</h3>
			<p className="text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>
		</div>
	);
}
