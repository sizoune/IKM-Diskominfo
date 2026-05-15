type PixelBlocksProps = {
	size?: number;
	gap?: number;
	opacity?: number;
	className?: string;
};

/**
 * 3x3 decorative grid that references the new Kominfo logo's blocky pixel style.
 * Layout (1-9):
 *   red    .      blue
 *   blue   sky    .
 *   blue   blue   amber
 */
export function PixelBlocks({
	size = 14,
	gap = 4,
	opacity = 0.85,
	className = "",
}: PixelBlocksProps) {
	const colors = [
		"var(--red)",
		"transparent",
		"var(--blue)",
		"var(--blue)",
		"var(--sky)",
		"transparent",
		"var(--blue)",
		"var(--blue)",
		"var(--amber)",
	];
	return (
		<div
			className={className}
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(3, ${size}px)`,
				gridTemplateRows: `repeat(3, ${size}px)`,
				gap: `${gap}px`,
				opacity,
				pointerEvents: "none",
			}}
			aria-hidden="true"
		>
			{colors.map((c, i) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: static decorative grid
					key={i}
					style={{
						background: c,
						borderRadius: "3px",
					}}
				/>
			))}
		</div>
	);
}
