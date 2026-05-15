type LiveDataCardProps = {
	year: number;
	score: number | null;
	mutuLabel: string;
};

export function LiveDataCard({ year, score, mutuLabel }: LiveDataCardProps) {
	const pct = score != null ? Math.min(Math.max((score / 4) * 100, 0), 100) : 0;
	const displayScore = score != null ? score.toFixed(2) : "—";

	return (
		<div className="relative overflow-hidden rounded-2xl bg-[var(--navy)] p-6 text-white shadow-2xl shadow-[rgba(10,31,68,0.25)]">
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(circle at 90% 10%, rgba(96,165,250,0.25), transparent 50%)",
				}}
				aria-hidden
			/>
			<div className="relative">
				<div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--sky)]">
					● INDEKS {year}
				</div>
				<div
					data-testid="score-display"
					className="my-2 text-[56px] font-black leading-none text-[var(--amber)]"
				>
					{displayScore}
				</div>
				<span className="inline-block rounded-full bg-[rgba(245,158,11,0.18)] px-3 py-1 text-[11px] font-extrabold tracking-wider text-[var(--amber)]">
					{mutuLabel}
				</span>
				<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
					<div
						data-testid="bar-fill"
						className="h-full rounded-full"
						style={{
							width: `${pct}%`,
							background: "linear-gradient(90deg, var(--amber), var(--sky))",
						}}
					/>
				</div>
				<div className="mt-4 flex items-center justify-between text-[11px] text-slate-300">
					<span>0 — 4.00 skala</span>
					<span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
						<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
						LIVE
					</span>
				</div>
			</div>
		</div>
	);
}
