type SectionHeaderProps = {
	kicker: string;
	title: string;
	titleAccent?: string;
	subtitle?: string;
	align?: "center" | "left";
};

export function SectionHeader({
	kicker,
	title,
	titleAccent,
	subtitle,
	align = "center",
}: SectionHeaderProps) {
	const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
	return (
		<div className={`mb-10 max-w-2xl ${alignClass}`}>
			<div
				className={`mb-2 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--blue)]`}
			>
				<span className="h-0.5 w-6 bg-[var(--amber)]" aria-hidden />
				{kicker}
				{align === "center" ? (
					<span className="h-0.5 w-6 bg-[var(--amber)]" aria-hidden />
				) : null}
			</div>
			<h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--navy)] leading-tight">
				{title}
				{titleAccent ? (
					<>
						{" "}
						<span className="text-[var(--blue)]">{titleAccent}</span>
					</>
				) : null}
			</h2>
			{subtitle ? (
				<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
					{subtitle}
				</p>
			) : null}
		</div>
	);
}
