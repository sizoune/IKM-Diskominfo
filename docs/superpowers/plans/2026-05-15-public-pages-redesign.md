# Public Pages UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign 3 public pages (landing, hasil IKM, survey wizard) dari palette indigo/violet ke palette Kominfo (navy/blue/amber/red) dengan sistem desain D2 White Civic yang konsisten.

**Architecture:** Foundation-first (CSS tokens) → shared components (SectionHeader, PixelBlocks, LiveDataCard, FeatureCard) → layout components (PublicNavbar, PublicFooter) → routes (landing, IKM, survey). Setiap task menghasilkan state yang viewable di dev server.

**Tech Stack:** TanStack Start, React 19, Tailwind CSS v4 (with `@theme inline`), shadcn/ui (new-york), Plus Jakarta Sans font, Vitest + Testing Library, Biome for lint/format.

**Spec reference:** `docs/superpowers/specs/2026-05-15-public-pages-redesign-design.md`

**Conventions:**
- Tabs untuk indentasi (Biome config)
- Double quotes untuk JS/TS strings
- Path alias `@/*` di tsconfig, `#/*` di runtime imports
- Test files co-located dengan source: `foo.tsx` + `foo.test.tsx`
- Pre-commit: run `pnpm check` (Biome lint + format) sebelum commit

**Commit message format:** `<type>(scope): <description>` — types: feat, fix, refactor, style, test, chore.

---

## File Structure

**Files to create:**

| Path | Responsibility |
|---|---|
| `src/components/section-header.tsx` | Reusable section header: kicker + h2 + subtitle |
| `src/components/section-header.test.tsx` | Smoke + props tests |
| `src/components/pixel-blocks.tsx` | 3×3 decorative grid (nod ke logo Kominfo baru) |
| `src/components/pixel-blocks.test.tsx` | Render test, custom size/opacity |
| `src/components/live-data-card.tsx` | Navy card untuk hero — show IKM live score, mutu, scale |
| `src/components/live-data-card.test.tsx` | Render with mock data, conditional badge |
| `src/components/feature-card.tsx` | Card dengan side-strip accent (navy/red/amber) |
| `src/components/feature-card.test.tsx` | Render + accent variants |

**Files to modify:**

| Path | Changes |
|---|---|
| `src/styles.css` | Replace palette tokens (indigo/violet → navy/blue/amber/red); add `.accent-underline` utility; **remove** `glass-card`, `gradient-hero`, `gradient-text` |
| `src/components/public-navbar.tsx` | Top-stripe prepend; navy crest; nav links navy + amber active underline; remove indigo gradient login button |
| `src/components/public-footer.tsx` | Darker bg `#0a1429`; amber crest icon; sky-300 headers |
| `src/routes/index.tsx` | Full rewrite — hero with LiveDataCard, stats banner, layanan cards, tentang split, steps, CTA banner |
| `src/lib/ikm.ts` | Update `getMutu()` color string mapping (no breaking change — same `green`/`blue`/`yellow`/`red` strings, ikm.tsx + bar helpers map to new hex) |
| `src/routes/guest/ikm.tsx` | New header pattern, navy overall card with amber grade box, side-strip stat cards, navy table header, updated `getBadgeColor()`/`getBarColor()`/`getOverallBgColor()` |
| `src/routes/guest/survey.index.tsx` | Step indicator: navy/amber/gray bubbles; card border-top amber; question options amber selected state; step-3 keep green semantic |

---

## Task 1: Replace CSS palette tokens & utility classes

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Read current styles.css** to confirm structure

Run: `cat src/styles.css`
Expected: see existing `:root` block dengan `--background: #F5F3FF`, `--primary: #6366F1`, dan utility classes `glass-card`, `gradient-hero`, `gradient-text`, `animate-float`.

- [ ] **Step 2: Rewrite `src/styles.css`** dengan palette Kominfo

```css
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap");

@import 'tailwindcss' source('./');

@import 'tw-animate-css';

body {
  @apply m-0;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family:
    source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

:root {
  /* === Kominfo Brand Palette === */
  --navy: #0a1f44;
  --navy-2: #1e3a8a;
  --blue: #2563eb;
  --sky: #60a5fa;
  --red: #991b1b;
  --amber: #f59e0b;
  --amber-soft: #fef3c7;

  /* === shadcn semantic tokens (remapped) === */
  --background: #ffffff;
  --foreground: #0a1f44;
  --card: #ffffff;
  --card-foreground: #0a1f44;
  --popover: #ffffff;
  --popover-foreground: #0a1f44;
  --primary: #0a1f44;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0a1f44;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #fef3c7;
  --accent-foreground: #92400e;
  --destructive: #991b1b;
  --destructive-foreground: #ffffff;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #2563eb;
  --chart-1: #0a1f44;
  --chart-2: #2563eb;
  --chart-3: #60a5fa;
  --chart-4: #f59e0b;
  --chart-5: #991b1b;
  --radius: 0.625rem;
  --sidebar: #0a1f44;
  --sidebar-foreground: #ffffff;
  --sidebar-primary: #f59e0b;
  --sidebar-primary-foreground: #0a1f44;
  --sidebar-accent: #1e3a8a;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: #1e3a8a;
  --sidebar-ring: #f59e0b;
  --font-heading: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-navy: var(--navy);
  --color-navy-2: var(--navy-2);
  --color-blue-brand: var(--blue);
  --color-sky-brand: var(--sky);
  --color-red-brand: var(--red);
  --color-amber-brand: var(--amber);
  --color-amber-soft: var(--amber-soft);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-weight: 700;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@layer utilities {
  .accent-underline {
    position: relative;
    display: inline-block;
  }
  .accent-underline::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 6px;
    background: var(--amber);
    opacity: 0.55;
    border-radius: 3px;
    z-index: -1;
  }
  .top-stripe-kominfo {
    height: 4px;
    background: linear-gradient(90deg, var(--red) 0%, var(--red) 60%, var(--amber) 60%, var(--amber) 100%);
  }
  .animate-pulse-soft {
    animation: pulse-soft 1.6s ease-in-out infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  /* Legacy utilities — still used by admin pages and survey.$formId.tsx (out of scope for this redesign).
     Remap to new Kominfo palette so admin pages don't visually break.
     Remove these once admin redesign happens. */
  .glass-card {
    @apply backdrop-blur-xl border shadow-xl;
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(226, 232, 240, 0.6);
  }
  .gradient-hero {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
  }
  .gradient-text {
    background: linear-gradient(90deg, var(--navy), var(--blue));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}
```

**Notes:**
- `glass-card`, `gradient-hero`, `gradient-text` utilities di-**remap** ke Kominfo palette (bukan dihapus) — masih dipakai oleh admin pages dan `guest/survey.$formId.tsx` (keduanya out-of-scope). Akan dihapus saat admin redesign.
- Tambah weight 800 dan 900 ke font-face URL (untuk h1 `font-black`).
- `.accent-underline` butuh `z-index: -1` supaya tertulis di bawah text.
- Public pages (`index.tsx`, `ikm.tsx`, `survey.index.tsx`) tidak akan referensi utilities legacy lagi setelah Task 8/10/11.

- [ ] **Step 3: Run lint+format**

Run: `pnpm check`
Expected: no errors (atau auto-fix dengan `pnpm format` jika ada perbedaan kecil).

- [ ] **Step 4: Start dev server & visual check**

Run: `pnpm dev` (background; biarkan jalan untuk task selanjutnya)
Open: `http://localhost:3000` → halaman akan "rusak" sementara (palette mismatch dengan komponen yang masih indigo) — ini expected. Verify background turun ke putih, font tetap Plus Jakarta Sans.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "refactor(styles): swap palette indigo/violet to Kominfo navy/amber tokens"
```

---

## Task 2: Create `SectionHeader` component

**Files:**
- Create: `src/components/section-header.tsx`
- Create: `src/components/section-header.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/section-header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
	it("renders kicker, title, and subtitle", () => {
		render(
			<SectionHeader
				kicker="Layanan Kami"
				title="Sistem penilaian"
				titleAccent="yang transparan"
				subtitle="Tiga pilar utama platform IKM."
			/>,
		);
		expect(screen.getByText("Layanan Kami")).toBeInTheDocument();
		expect(screen.getByText(/Sistem penilaian/)).toBeInTheDocument();
		expect(screen.getByText("yang transparan")).toBeInTheDocument();
		expect(screen.getByText("Tiga pilar utama platform IKM.")).toBeInTheDocument();
	});

	it("renders without optional subtitle and accent", () => {
		render(<SectionHeader kicker="Panduan" title="Tiga langkah" />);
		expect(screen.getByText("Panduan")).toBeInTheDocument();
		expect(screen.getByText("Tiga langkah")).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/section-header.test.tsx`
Expected: FAIL — "Cannot find module './section-header'".

- [ ] **Step 3: Create the component**

Create `src/components/section-header.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/section-header.test.tsx`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/section-header.tsx src/components/section-header.test.tsx
git commit -m "feat(components): add SectionHeader with kicker/title/accent/subtitle"
```

---

## Task 3: Create `PixelBlocks` decorative component

**Files:**
- Create: `src/components/pixel-blocks.tsx`
- Create: `src/components/pixel-blocks.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/pixel-blocks.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PixelBlocks } from "./pixel-blocks";

describe("PixelBlocks", () => {
	it("renders a 3x3 grid (9 cells)", () => {
		const { container } = render(<PixelBlocks />);
		const cells = container.querySelectorAll("span");
		expect(cells).toHaveLength(9);
	});

	it("respects custom size prop", () => {
		const { container } = render(<PixelBlocks size={20} />);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.gridTemplateColumns).toContain("20px");
	});

	it("accepts a className for positioning", () => {
		const { container } = render(<PixelBlocks className="absolute top-2" />);
		const grid = container.firstChild as HTMLElement;
		expect(grid.className).toContain("absolute");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/pixel-blocks.test.tsx`
Expected: FAIL — "Cannot find module './pixel-blocks'".

- [ ] **Step 3: Create the component**

Create `src/components/pixel-blocks.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/pixel-blocks.test.tsx`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/pixel-blocks.tsx src/components/pixel-blocks.test.tsx
git commit -m "feat(components): add PixelBlocks decorative 3x3 grid (Kominfo logo motif)"
```

---

## Task 4: Create `LiveDataCard` component

**Files:**
- Create: `src/components/live-data-card.tsx`
- Create: `src/components/live-data-card.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/live-data-card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LiveDataCard } from "./live-data-card";

describe("LiveDataCard", () => {
	it("renders score, year, mutu, and scale", () => {
		render(
			<LiveDataCard year={2025} score={3.42} mutuLabel="Mutu B · Baik" />,
		);
		expect(screen.getByText("INDEKS 2025")).toBeInTheDocument();
		expect(screen.getByText("3.42")).toBeInTheDocument();
		expect(screen.getByText("Mutu B · Baik")).toBeInTheDocument();
		expect(screen.getByText(/0 — 4.00 skala/)).toBeInTheDocument();
		expect(screen.getByText("LIVE")).toBeInTheDocument();
	});

	it("renders progress bar based on score", () => {
		const { container } = render(
			<LiveDataCard year={2025} score={2.0} mutuLabel="Mutu C" />,
		);
		const fill = container.querySelector('[data-testid="bar-fill"]') as HTMLElement;
		expect(fill.style.width).toBe("50%");
	});

	it("shows placeholder dash when score is null", () => {
		render(<LiveDataCard year={2025} score={null} mutuLabel="—" />);
		expect(screen.getByText("—")).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/live-data-card.test.tsx`
Expected: FAIL — "Cannot find module './live-data-card'".

- [ ] **Step 3: Create the component**

Create `src/components/live-data-card.tsx`:

```tsx
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
				<div className="my-2 text-[56px] font-black leading-none text-[var(--amber)]">
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/live-data-card.test.tsx`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/live-data-card.tsx src/components/live-data-card.test.tsx
git commit -m "feat(components): add LiveDataCard for hero IKM score display"
```

---

## Task 5: Create `FeatureCard` with side-strip accent

**Files:**
- Create: `src/components/feature-card.tsx`
- Create: `src/components/feature-card.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/feature-card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureCard } from "./feature-card";

describe("FeatureCard", () => {
	it("renders title, description, and icon", () => {
		render(
			<FeatureCard
				accent="navy"
				icon={<span data-testid="icon">★</span>}
				title="Survey Pelayanan"
				description="Form digital mudah diisi."
			/>,
		);
		expect(screen.getByText("Survey Pelayanan")).toBeInTheDocument();
		expect(screen.getByText("Form digital mudah diisi.")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders all three accent variants without crashing", () => {
		for (const accent of ["navy", "red", "amber"] as const) {
			const { unmount } = render(
				<FeatureCard
					accent={accent}
					icon={<span>i</span>}
					title={`Card ${accent}`}
					description="desc"
				/>,
			);
			expect(screen.getByText(`Card ${accent}`)).toBeInTheDocument();
			unmount();
		}
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/feature-card.test.tsx`
Expected: FAIL — "Cannot find module './feature-card'".

- [ ] **Step 3: Create the component**

Create `src/components/feature-card.tsx`:

```tsx
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

export function FeatureCard({ accent, icon, title, description }: FeatureCardProps) {
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
			<h3 className="mb-2 text-base font-extrabold text-[var(--navy)]">{title}</h3>
			<p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
		</div>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/feature-card.test.tsx`
Expected: PASS — 2 tests (4 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/feature-card.tsx src/components/feature-card.test.tsx
git commit -m "feat(components): add FeatureCard with side-strip accent variants"
```

---

## Task 6: Redesign `PublicNavbar`

**Files:**
- Modify: `src/components/public-navbar.tsx`

- [ ] **Step 1: Replace `src/components/public-navbar.tsx`** dengan implementasi baru

```tsx
import { Link } from "@tanstack/react-router";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function PublicNavbar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="top-stripe-kominfo" aria-hidden />
			<header className="sticky top-0 z-50 border-b border-slate-100 bg-white/92 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link to="/" className="flex items-center gap-3">
						<div className="grid size-8 place-items-center rounded-md bg-[var(--navy)] text-base font-black text-white">
							T
						</div>
						<div className="leading-tight">
							<div className="text-[11px] font-extrabold tracking-wide text-[var(--navy)]">
								DISKOMINFO TABALONG
							</div>
							<div className="text-[10px] text-muted-foreground">
								Indeks Kepuasan Masyarakat
							</div>
						</div>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							to="/guest/survey"
							className="relative flex min-h-[44px] items-center text-sm font-medium text-slate-700 transition-colors hover:text-[var(--navy)]"
							activeProps={{
								className:
									"relative flex min-h-[44px] items-center text-sm font-bold text-[var(--navy)] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[var(--amber)]",
							}}
						>
							Survey
						</Link>
						<Link
							to="/guest/ikm"
							className="relative flex min-h-[44px] items-center text-sm font-medium text-slate-700 transition-colors hover:text-[var(--navy)]"
							activeProps={{
								className:
									"relative flex min-h-[44px] items-center text-sm font-bold text-[var(--navy)] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[var(--amber)]",
							}}
						>
							Hasil IKM
						</Link>
						<Button
							asChild
							size="sm"
							className="min-h-[44px] rounded-full bg-[var(--navy)] px-4 font-bold text-white hover:bg-[var(--navy-2)]"
						>
							<Link to="/login">
								<LogIn className="mr-2 size-4" />
								Login
							</Link>
						</Button>
					</nav>

					{/* Mobile hamburger */}
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="min-h-[44px] min-w-[44px] text-[var(--navy)] hover:bg-slate-100 md:hidden"
							>
								<Menu className="size-5" />
								<span className="sr-only">Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-72 border-slate-100 bg-white/98 backdrop-blur-xl"
						>
							<SheetHeader>
								<SheetTitle className="flex items-center gap-2.5">
									<div className="grid size-7 place-items-center rounded-md bg-[var(--navy)] text-xs font-black text-white">
										T
									</div>
									<span className="font-extrabold text-[var(--navy)]">
										IKM Diskominfo
									</span>
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-1 px-4">
								<SheetClose asChild>
									<Link
										to="/guest/survey"
										className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--navy)]"
										onClick={() => setOpen(false)}
									>
										Survey
									</Link>
								</SheetClose>
								<SheetClose asChild>
									<Link
										to="/guest/ikm"
										className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--navy)]"
										onClick={() => setOpen(false)}
									>
										Hasil IKM
									</Link>
								</SheetClose>
								<SheetClose asChild>
									<Link
										to="/login"
										className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--navy)] px-3 text-sm font-bold text-white transition-colors hover:bg-[var(--navy-2)]"
										onClick={() => setOpen(false)}
									>
										<LogIn className="size-4" />
										Login
									</Link>
								</SheetClose>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>
		</>
	);
}
```

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Dev server visual check**

Open: `http://localhost:3000` (if not running, `pnpm dev`)
Expected: navbar putih dengan top stripe merah-amber tampak, crest navy "T" + 2-line text, link styling default. Halaman lain masih indigo (expected — fix di task selanjutnya).

- [ ] **Step 4: Test mobile responsive**

Resize browser ≤ 768px atau buka DevTools mobile mode. Buka hamburger menu, verify nav links muncul dengan styling baru.

- [ ] **Step 5: Commit**

```bash
git add src/components/public-navbar.tsx
git commit -m "feat(navbar): redesign PublicNavbar with Kominfo palette and top stripe"
```

---

## Task 7: Redesign `PublicFooter`

**Files:**
- Modify: `src/components/public-footer.tsx`

- [ ] **Step 1: Replace `src/components/public-footer.tsx`**

```tsx
import { Link } from "@tanstack/react-router";

export function PublicFooter() {
	return (
		<footer className="bg-[#0a1429] text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid gap-10 md:grid-cols-3">
					{/* Brand column */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="grid size-10 place-items-center rounded-md bg-[var(--amber)] text-lg font-black text-[var(--navy)]">
								T
							</div>
							<div className="leading-tight">
								<p className="text-sm font-extrabold tracking-wide">
									DISKOMINFO TABALONG
								</p>
								<p className="text-[11px] text-slate-400">
									Indeks Kepuasan Masyarakat
								</p>
							</div>
						</div>
						<p className="max-w-sm text-sm leading-relaxed text-slate-400">
							Sistem survei dan penilaian kualitas pelayanan publik Dinas
							Komunikasi dan Informatika Kabupaten Tabalong.
						</p>
					</div>

					{/* Quick links */}
					<div className="flex flex-col gap-3">
						<h3 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--sky)]">
							Tautan Cepat
						</h3>
						<nav className="flex flex-col gap-2">
							<Link
								to="/guest/survey"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Survey Kepuasan
							</Link>
							<Link
								to="/guest/ikm"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Hasil IKM
							</Link>
							<Link
								to="/login"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Login Admin
							</Link>
						</nav>
					</div>

					{/* Info column */}
					<div className="flex flex-col gap-3">
						<h3 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--sky)]">
							Tentang
						</h3>
						<p className="text-sm leading-relaxed text-slate-400">
							Platform pengukuran kualitas layanan publik melalui partisipasi
							aktif masyarakat berdasarkan Permenpan RB 14/2017.
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] text-slate-500">
					&copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika
					Kabupaten Tabalong — Hak cipta dilindungi.
				</div>
			</div>
		</footer>
	);
}
```

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Visual check**

Open: `http://localhost:3000`, scroll ke bawah. Footer dark navy `#0a1429`, amber crest, 3-column grid intact.

- [ ] **Step 4: Commit**

```bash
git add src/components/public-footer.tsx
git commit -m "feat(footer): redesign PublicFooter with darker navy bg and amber crest"
```

---

## Task 8: Rewrite landing page (`src/routes/index.tsx`)

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Replace `src/routes/index.tsx`** dengan implementation baru

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BarChart3,
	CheckCircle2,
	ClipboardList,
	Shield,
	Sparkles,
} from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { LiveDataCard } from "@/components/live-data-card";
import { PixelBlocks } from "@/components/pixel-blocks";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "IKM — Indeks Kepuasan Masyarakat | Diskominfo" },
			{
				name: "description",
				content:
					"Sistem survei Indeks Kepuasan Masyarakat (IKM) terhadap pelayanan publik Dinas Komunikasi dan Informatika Kabupaten Tabalong.",
			},
			{
				property: "og:title",
				content: "IKM — Indeks Kepuasan Masyarakat | Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Sistem survei Indeks Kepuasan Masyarakat (IKM) terhadap pelayanan publik Dinas Komunikasi dan Informatika Kabupaten Tabalong.",
			},
			{ property: "og:url", content: "https://ikm.kominfo.go.id/" },
		],
	}),
	component: LandingPage,
});

function LandingPage() {
	const currentYear = new Date().getFullYear();
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />

			{/* === Hero === */}
			<section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 px-4 py-16 md:py-20">
				<PixelBlocks className="absolute top-16 right-8 hidden md:grid" />
				<div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
					<div>
						<span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[var(--amber-soft)] px-3 py-1.5 text-[11px] font-bold text-amber-800">
							<span className="size-1.5 rounded-full bg-[var(--amber)]" />
							Survei Resmi {currentYear} · Terbuka untuk warga
						</span>
						<h1 className="text-3xl font-black leading-[1.05] tracking-tight text-[var(--navy)] md:text-5xl">
							Suara Anda,
							<br />
							arah{" "}
							<span className="accent-underline">pelayanan</span>
							<br />
							<span className="text-[var(--blue)]">kami.</span>
						</h1>
						<p className="mt-4 max-w-md text-base leading-relaxed text-slate-700">
							Berpartisipasilah dalam Indeks Kepuasan Masyarakat Diskominfo
							Kabupaten Tabalong. Pendapat Anda menjadi bahan evaluasi nyata
							untuk pelayanan publik yang lebih baik.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Button
								asChild
								size="lg"
								className="min-h-[44px] bg-[var(--navy)] px-6 font-bold text-white hover:bg-[var(--navy-2)]"
							>
								<Link to="/guest/survey">
									<ClipboardList className="mr-2 size-5" />
									Mulai Survey
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="min-h-[44px] border-slate-200 px-6 font-bold text-[var(--navy)]"
							>
								<Link to="/guest/ikm">
									<BarChart3 className="mr-2 size-5" />
									Lihat Hasil IKM
								</Link>
							</Button>
						</div>
						<div className="mt-7 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-5 text-[11px] text-muted-foreground">
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									5 menit
								</div>
								<div>Waktu pengisian</div>
							</div>
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									Anonim
								</div>
								<div>Tanpa akun</div>
							</div>
							<div>
								<div className="text-sm font-extrabold text-[var(--navy)]">
									Real-time
								</div>
								<div>Data terbuka</div>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<LiveDataCard
							year={currentYear - 1}
							score={3.42}
							mutuLabel="MUTU B · BAIK"
						/>
						<div className="grid grid-cols-2 gap-2.5">
							<div className="rounded-xl border border-slate-200 bg-white p-3.5">
								<div className="text-xl font-black text-[var(--navy)]">
									1.284
								</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
									Responden
								</div>
							</div>
							<div className="rounded-xl border border-amber-200 bg-[var(--amber-soft)] p-3.5">
								<div className="text-xl font-black text-amber-800">9</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
									Unsur Nilai
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* === Stats Banner === */}
			<section className="relative overflow-hidden bg-[var(--navy)] px-4 py-10 text-white">
				<div className="pointer-events-none absolute -top-10 -right-10 size-[200px] rounded-full border border-sky-400/20" />
				<div className="pointer-events-none absolute -top-5 -right-5 size-[160px] rounded-full border border-sky-400/10" />
				<div className="container relative mx-auto grid max-w-5xl gap-6 md:grid-cols-4">
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">
							<span className="text-[var(--amber)]">3.42</span>
							<span className="text-base text-slate-400">/4.00</span>
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Indeks Tahun {currentYear - 1}
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">1.284</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Total Responden
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl">
							9 <span className="text-sm text-slate-400">unsur</span>
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Aspek Penilaian
						</div>
					</div>
					<div className="border-l-2 border-[var(--amber)] pl-4">
						<div className="text-2xl font-black md:text-3xl text-[var(--amber)]">
							B
						</div>
						<div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--sky)]">
							Mutu Pelayanan
						</div>
					</div>
				</div>
			</section>

			{/* === Layanan === */}
			<section className="px-4 py-16">
				<div className="container mx-auto max-w-5xl">
					<SectionHeader
						kicker="Layanan Kami"
						title="Sistem penilaian"
						titleAccent="yang transparan"
						subtitle="Tiga pilar utama platform IKM Diskominfo Tabalong untuk memastikan akuntabilitas pelayanan publik."
					/>
					<div className="grid gap-4 md:grid-cols-3">
						<FeatureCard
							accent="navy"
							icon={<ClipboardList className="size-5" />}
							title="Survey Pelayanan"
							description="Formulir digital mudah diisi tanpa registrasi. Sampaikan penilaian Anda dalam 5 menit dengan 9 unsur kepuasan."
						/>
						<FeatureCard
							accent="red"
							icon={<Shield className="size-5" />}
							title="Transparansi Data"
							description="Hasil survei terbuka untuk publik. Komitmen pemerintah terhadap akuntabilitas pelayanan prima."
						/>
						<FeatureCard
							accent="amber"
							icon={<BarChart3 className="size-5" />}
							title="Hasil Real-time"
							description="Pantau indeks kepuasan masyarakat dengan visualisasi data yang diperbarui secara berkala."
						/>
					</div>
				</div>
			</section>

			{/* === Tentang IKM === */}
			<section className="bg-slate-50 px-4 py-16">
				<div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
					<div>
						<SectionHeader
							kicker="Tentang IKM"
							title="Apa itu Indeks"
							titleAccent="Kepuasan Masyarakat?"
							align="left"
						/>
						<p className="text-sm leading-relaxed text-slate-700">
							Indeks Kepuasan Masyarakat (IKM) adalah pengukuran kuantitatif dan
							kualitatif tingkat kepuasan masyarakat terhadap pelayanan publik.
							Bertujuan mengetahui kinerja unit pelayanan secara berkala sebagai
							bahan kebijakan peningkatan kualitas.
						</p>
						<div className="mt-5 flex flex-col gap-2.5">
							{[
								"Meningkatkan kualitas pelayanan publik secara berkelanjutan",
								"Mendorong partisipasi aktif masyarakat",
								"Akuntabilitas dan transparansi pemerintah daerah",
							].map((item) => (
								<div key={item} className="flex items-start gap-2.5">
									<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-[var(--amber-soft)] text-[11px] font-black text-amber-800">
										✓
									</span>
									<span className="text-sm text-slate-700">{item}</span>
								</div>
							))}
						</div>
					</div>
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[var(--navy-2)] p-8 text-white">
						<div className="absolute -bottom-2 -right-2 rotate-[-12deg] opacity-15">
							<PixelBlocks size={18} gap={4} opacity={1} />
						</div>
						<span className="mb-3 inline-block rounded bg-[var(--amber)] px-2 py-0.5 text-[10px] font-black tracking-wider text-[var(--navy)]">
							★ DISKOMINFO TABALONG
						</span>
						<h4 className="text-xl font-black">Sistem Survei IKM</h4>
						<div className="mt-1 text-xs text-[var(--sky)]">
							Berbasis Permenpan RB 14/2017
						</div>
						<div className="mt-6 grid grid-cols-2 gap-2.5">
							<div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
								<div className="text-2xl font-black text-[var(--amber)]">9</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									Unsur Penilaian
								</div>
							</div>
							<div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
								<div className="text-2xl font-black text-[var(--amber)]">4</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									Kategori Mutu
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* === Cara Mengisi Survey === */}
			<section className="px-4 py-16">
				<div className="container mx-auto max-w-4xl">
					<SectionHeader
						kicker="Panduan"
						title="Tiga langkah"
						titleAccent="mudah"
						subtitle="Berpartisipasi dalam survei IKM hanya butuh 5 menit. Tidak perlu akun, sepenuhnya anonim."
					/>
					<div className="grid gap-4 md:grid-cols-3">
						{[
							{
								step: "01",
								title: "Buka Formulir",
								desc: 'Klik "Mulai Survey" dan akses formulir penilaian online tanpa perlu membuat akun.',
							},
							{
								step: "02",
								title: "Isi Penilaian",
								desc: "Berikan penilaian jujur pada setiap aspek pelayanan berdasarkan pengalaman Anda.",
							},
							{
								step: "03",
								title: "Kirim & Selesai",
								desc: "Setelah semua pertanyaan terisi, kirim jawaban. Hasil langsung terekam dalam sistem.",
							},
						].map(({ step, title, desc }) => (
							<div
								key={step}
								className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
							>
								<span className="absolute top-4 right-5 text-4xl font-black text-slate-100">
									{step}
								</span>
								<div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									Langkah {step}
								</div>
								<h4 className="mt-2 mb-2 text-base font-extrabold text-[var(--navy)]">
									{title}
								</h4>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* === CTA Banner === */}
			<section className="bg-slate-50 px-4 pt-4 pb-16">
				<div className="container mx-auto max-w-5xl">
					<div className="relative grid gap-6 overflow-hidden rounded-2xl bg-[var(--navy)] p-8 text-white md:grid-cols-[2fr_1fr] md:items-center md:p-10">
						<div
							className="pointer-events-none absolute -bottom-10 -left-10 size-[200px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)",
							}}
							aria-hidden
						/>
						<div className="relative">
							<h3 className="text-2xl font-black leading-tight md:text-3xl">
								Siap berkontribusi untuk pelayanan{" "}
								<span className="text-[var(--amber)]">yang lebih baik?</span>
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-300">
								Mulai isi survei IKM sekarang. Setiap suara membantu Diskominfo
								Tabalong meningkatkan kualitas layanan publik.
							</p>
						</div>
						<div className="relative">
							<Button
								asChild
								size="lg"
								className="min-h-[48px] w-full bg-[var(--amber)] font-black tracking-wide text-[var(--navy)] hover:bg-amber-400"
							>
								<Link to="/guest/survey">
									<Sparkles className="mr-2 size-5" />
									ISI SURVEY SEKARANG
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<PublicFooter />
		</div>
	);
}
```

**Notes:**
- The "5 menit / Anonim / Real-time" trust strip dan stats data (3.42, 1.284, 9, B) di-hardcode untuk demo. Task follow-up bisa wire ke real data dari `getIkmData()` (mengubah ke `useQuery` + loading skeleton). Untuk sekarang stick dengan static value untuk hindari coupling.
- `CheckCircle2` import dihapus karena tidak dipakai lagi (digantikan span ✓). Tapi `lucide-react` masih needed untuk `ClipboardList`, `Shield`, `BarChart3`, `Sparkles`.
- Removed `Star`, `Users`, `CheckCircle2` dari import.

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Run type check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run tests** (ensure shared components still pass)

Run: `pnpm vitest run`
Expected: all pass.

- [ ] **Step 5: Dev server visual check**

Open: `http://localhost:3000`
Verify:
- Hero: badge, headline dengan underline amber di "pelayanan", LiveDataCard di kanan
- Stats banner navy dengan 4 cell amber-bordered
- 3 feature cards dengan side-strip (navy/red/amber)
- Tentang split dengan navy info-card + pixel blocks dekoratif
- 3 step cards dengan giant number watermark
- CTA banner navy dengan tombol amber
- Footer baru sudah tampak

- [ ] **Step 6: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(landing): rewrite landing page with D2 White Civic design"
```

---

## Task 9: Update `getMutu()` color mapping (no breaking change)

**Files:**
- Modify: `src/lib/ikm.ts`

**Context:** `getMutu()` returns `color: "green" | "blue" | "yellow" | "red"`. We tidak ubah string ini (banyak callers), tapi tambah helper functions yang map ke palette baru. Helpers ini akan dipakai di Task 10.

- [ ] **Step 1: Append helpers** ke `src/lib/ikm.ts`

Tambah di akhir file:

```ts
/** Map mutu color string to Tailwind badge classes (Kominfo palette). */
export function getMutuBadgeClasses(color: string): string {
	switch (color) {
		case "green":
			return "bg-green-100 text-green-800 border-green-300";
		case "blue":
			return "bg-blue-100 text-blue-800 border-blue-300";
		case "yellow":
			return "bg-amber-100 text-amber-800 border-amber-300";
		default:
			return "bg-red-100 text-red-800 border-red-300";
	}
}

/** Map mutu color string to bar/chart fill color (Kominfo palette hex). */
export function getMutuFillHex(color: string): string {
	switch (color) {
		case "green":
			return "#16a34a";
		case "blue":
			return "#2563eb";
		case "yellow":
			return "#f59e0b";
		default:
			return "#991b1b";
	}
}
```

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Run type check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/ikm.ts
git commit -m "feat(ikm): add getMutuBadgeClasses and getMutuFillHex helpers"
```

---

## Task 10: Redesign Hasil IKM dashboard (`src/routes/guest/ikm.tsx`)

**Files:**
- Modify: `src/routes/guest/ikm.tsx`

- [ ] **Step 1: Replace `src/routes/guest/ikm.tsx`** dengan implementation baru

```tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, ClipboardCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMutu, getMutuBadgeClasses, getMutuFillHex } from "@/lib/ikm";
import { getAvailableYears, getIkmData } from "@/server/ikm";

export const Route = createFileRoute("/guest/ikm")({
	head: () => ({
		meta: [
			{ title: "Hasil IKM — Indeks Kepuasan Masyarakat | Diskominfo" },
			{
				name: "description",
				content:
					"Lihat hasil Indeks Kepuasan Masyarakat (IKM) — data penilaian masyarakat terhadap kualitas pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:title",
				content: "Hasil IKM — Indeks Kepuasan Masyarakat | Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Lihat hasil Indeks Kepuasan Masyarakat (IKM) — data penilaian masyarakat terhadap kualitas pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{ property: "og:url", content: "https://ikm.kominfo.go.id/guest/ikm" },
		],
	}),
	component: IkmPage,
});

function IkmPage() {
	const currentYear = new Date().getFullYear();
	const [year, setYear] = useState(currentYear);

	const { data: years = [] } = useQuery({
		queryKey: ["ikm-years"],
		queryFn: () => getAvailableYears(),
	});

	const { data: ikmData = [] } = useQuery({
		queryKey: ["ikm-data", year],
		queryFn: () => getIkmData({ data: year }),
	});

	useEffect(() => {
		if (years.length > 0 && !years.includes(year)) {
			setYear(Math.max(...years));
		}
	}, [years, year]);

	const totalAvg =
		ikmData.length > 0
			? ikmData.reduce((sum, d) => sum + d.avgValue, 0) / ikmData.length
			: 0;
	const overall = getMutu(totalAvg);
	const ikmScore = totalAvg * (25 / 4);

	const totalResponden =
		ikmData.length > 0 ? Math.max(...ikmData.map((d) => d.totalResponden)) : 0;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />
			<div className="container mx-auto max-w-4xl flex-1 space-y-6 px-4 py-10">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="mb-2 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--blue)]">
							<span className="h-0.5 w-6 bg-[var(--amber)]" />
							Data Terbuka · Live
						</div>
						<h1 className="text-3xl font-black tracking-tight text-[var(--navy)] md:text-4xl">
							Hasil <span className="text-[var(--blue)]">IKM {year}</span>
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Indeks Kepuasan Masyarakat — Diskominfo Kabupaten Tabalong
						</p>
					</div>
					<Select
						value={String(year)}
						onValueChange={(v) => setYear(Number(v))}
					>
						<SelectTrigger className="min-h-[44px] w-40 rounded-lg border-slate-200 bg-white font-bold text-[var(--navy)]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-lg">
							{years.length > 0 ? (
								years.map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))
							) : (
								<SelectItem value={String(currentYear)}>{currentYear}</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Overall Card */}
				{ikmData.length > 0 && (
					<Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-2)] text-white shadow-xl">
						<div
							className="pointer-events-none absolute -top-12 -right-12 size-[220px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)",
							}}
							aria-hidden
						/>
						<div
							className="pointer-events-none absolute -bottom-10 -left-10 size-[180px] rounded-full"
							style={{
								background:
									"radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)",
							}}
							aria-hidden
						/>
						<CardContent className="relative grid items-center gap-6 p-8 sm:grid-cols-[auto_1fr_auto] sm:p-10">
							<div
								className="grid size-24 place-items-center rounded-2xl text-5xl font-black shadow-2xl shadow-amber-500/30 sm:size-28 sm:text-6xl"
								style={{ background: getMutuFillHex(overall.color), color: "#0a1f44" }}
							>
								{overall.grade}
							</div>
							<div>
								<div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sky)]">
									Penilaian Keseluruhan
								</div>
								<div className="mt-1 text-2xl font-black sm:text-3xl">
									{overall.label}
								</div>
								<span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold text-[var(--amber)]">
									★ Mutu {overall.grade}
								</span>
							</div>
							<div className="text-left sm:text-right">
								<div className="text-3xl font-black text-[var(--amber)] sm:text-4xl">
									{ikmScore.toFixed(2)}
								</div>
								<div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sky)]">
									IKM Score
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Stat Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--navy)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-slate-100 text-[var(--navy)]">
									<BarChart2 className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Nilai IKM
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{ikmScore.toFixed(2)}
									</div>
								</div>
							</div>
							<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full bg-[var(--navy)] transition-all duration-1000"
									style={{ width: `${Math.min(ikmScore, 100)}%` }}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--amber)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-[var(--amber-soft)] text-amber-800">
									<ClipboardCheck className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Mutu Pelayanan
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{overall.grade}
									</div>
								</div>
							</div>
							<div className="mt-3">
								<Badge
									variant="outline"
									className={`${getMutuBadgeClasses(overall.color)} rounded-full px-3 py-1 text-xs font-bold`}
								>
									{overall.label}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden rounded-xl border-slate-200">
						<div className="absolute inset-y-0 left-0 w-[3px] bg-[var(--red)]" />
						<CardContent className="p-5">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-lg bg-red-100 text-[var(--red)]">
									<Users className="size-5" />
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Total Responden
									</div>
									<div className="text-2xl font-black text-[var(--navy)]">
										{totalResponden}
									</div>
								</div>
							</div>
							<div className="mt-3">
								<span className="inline-block rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
									{ikmData.length} unsur pelayanan dinilai
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Detail Table */}
				<Card className="overflow-hidden rounded-xl border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between bg-[var(--navy)] p-5 text-white">
						<CardTitle className="text-sm font-extrabold tracking-wide">
							Detail Per Unsur — Tahun {year}
						</CardTitle>
						<span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--amber)]">
							{ikmData.length} ASPEK
						</span>
					</CardHeader>
					<CardContent className="p-0">
						{ikmData.length > 0 ? (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Kode
											</TableHead>
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Unsur Pelayanan
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Rata-rata
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												NRR × 25/4
											</TableHead>
											<TableHead className="py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Mutu
											</TableHead>
											<TableHead className="py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)]">
												Responden
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ikmData.map((d, idx) => {
											const mutu = getMutu(d.avgValue);
											const ikm = d.avgValue * (25 / 4);
											return (
												<TableRow
													key={d.formQuestionId}
													className={
														idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
													}
												>
													<TableCell className="py-3">
														<span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-extrabold text-[var(--blue)]">
															{d.kode}
														</span>
													</TableCell>
													<TableCell className="py-3 text-sm font-medium text-slate-700">
														{d.text}
													</TableCell>
													<TableCell className="py-3 text-right font-mono text-sm font-bold text-[var(--navy)]">
														{d.avgValue.toFixed(2)}
													</TableCell>
													<TableCell className="py-3 text-right font-mono text-sm font-bold text-[var(--navy)]">
														{ikm.toFixed(2)}
													</TableCell>
													<TableCell className="py-3">
														<Badge
															variant="outline"
															className={`${getMutuBadgeClasses(mutu.color)} rounded-full px-2 py-0.5 text-[10px] font-bold`}
														>
															{mutu.grade} — {mutu.label}
														</Badge>
													</TableCell>
													<TableCell className="py-3 text-right text-sm font-medium text-slate-600">
														{d.totalResponden}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="space-y-4 py-20 text-center">
								<div className="mx-auto grid size-20 place-items-center rounded-full bg-slate-100">
									<BarChart2 className="size-10 text-slate-400" />
								</div>
								<div>
									<p className="text-lg font-extrabold text-[var(--navy)]">
										Belum Ada Data
									</p>
									<p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
										Belum ada data survey Indeks Kepuasan Masyarakat untuk tahun{" "}
										{year}.
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Bar Chart */}
				{ikmData.length > 0 && (
					<Card className="overflow-hidden rounded-xl border-slate-200">
						<CardHeader className="border-b border-slate-100 p-5">
							<CardTitle className="text-sm font-extrabold tracking-wide text-[var(--navy)]">
								Grafik Nilai Per Unsur
							</CardTitle>
						</CardHeader>
						<CardContent className="p-5 sm:p-6">
							<div className="space-y-4">
								{ikmData.map((d, idx) => {
									const mutu = getMutu(d.avgValue);
									const pct = (d.avgValue / 4) * 100;
									const barColor = getMutuFillHex(mutu.color);
									return (
										<div key={d.formQuestionId} className="space-y-1.5">
											<div className="flex items-end justify-between gap-3 text-sm">
												<span className="flex-1 truncate font-medium text-slate-700">
													<span className="mr-2 inline-block rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[var(--blue)]">
														{d.kode}
													</span>
													{d.text}
												</span>
												<div className="flex shrink-0 items-center gap-2">
													<span className="font-mono text-sm font-bold text-[var(--navy)]">
														{d.avgValue.toFixed(2)}
													</span>
													<span
														className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
														style={{ backgroundColor: barColor }}
													>
														{pct.toFixed(0)}%
													</span>
												</div>
											</div>
											<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
												<div
													className="h-full rounded-full transition-all duration-1000 ease-out"
													style={{
														width: `${pct}%`,
														backgroundColor: barColor,
														animationDelay: `${idx * 100}ms`,
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			<PublicFooter />
		</div>
	);
}
```

**Notes:**
- Hapus inline helper functions `getBadgeColor`, `getBarColor`, `getOverallBgColor` (digantikan oleh `getMutuBadgeClasses` + `getMutuFillHex` dari `@/lib/ikm`).
- Hapus `Star` import (sudah tidak dipakai — grade-box pakai huruf saja).
- Tetap pakai shadcn `Card`, `Badge`, `Select`, `Table` (tidak ganti komponen — hanya restyle).

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Run type check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run`
Expected: all pass.

- [ ] **Step 5: Dev server visual check**

Open: `http://localhost:3000/guest/ikm`
Verify:
- Header dengan kicker biru, h1 navy+blue accent, year-select pill
- Overall card navy dengan grade box (A=green, B=blue, C=amber, D=red), IKM score amber di kanan
- 3 stat cards side-strip (navy/amber/red)
- Table dengan header navy, kode-pill biru, mutu badges
- Bar chart dengan bar fill color sesuai mutu

Test dengan year yang tidak ada data → empty state should show.

- [ ] **Step 6: Commit**

```bash
git add src/routes/guest/ikm.tsx
git commit -m "feat(ikm): redesign Hasil IKM dashboard with Kominfo palette"
```

---

## Task 11: Redesign Survey wizard (`src/routes/guest/survey.index.tsx`)

**Files:**
- Modify: `src/routes/guest/survey.index.tsx`

- [ ] **Step 1: Replace `src/routes/guest/survey.index.tsx`** dengan implementation baru

```tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, CheckCircle2, ClipboardList, User } from "lucide-react";
import { useState } from "react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	ANSWER_POIN,
	JK,
	PEKERJAAN,
	PENDIDIKAN,
	STATUS,
} from "@/lib/constants";
import { getForms } from "@/server/forms";
import { getActiveLayanan } from "@/server/layanan";
import { getQuestionsByFormId } from "@/server/questions";
import { submitSurvey } from "@/server/survey-submit";

export const Route = createFileRoute("/guest/survey/")({
	head: () => ({
		meta: [
			{ title: "Isi Survey Kepuasan — IKM Diskominfo" },
			{
				name: "description",
				content:
					"Sampaikan penilaian Anda terhadap kualitas pelayanan publik melalui survey Indeks Kepuasan Masyarakat (IKM) Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:title",
				content: "Isi Survey Kepuasan — IKM Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Sampaikan penilaian Anda terhadap kualitas pelayanan publik melalui survey Indeks Kepuasan Masyarakat (IKM) Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:url",
				content: "https://ikm.kominfo.go.id/guest/survey",
			},
		],
	}),
	component: SurveyPage,
});

const STEP_LABELS = ["Data Diri", "Survey", "Selesai"];

function StepIndicator({ current }: { current: number }) {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				{[1, 2, 3].map((s, idx) => {
					const isCompleted = s < current;
					const isActive = s === current;
					const bubbleClass = isCompleted
						? "bg-[var(--navy)] text-[var(--amber)]"
						: isActive
							? "bg-[var(--amber)] text-[var(--navy)] ring-4 ring-amber-200"
							: "bg-slate-100 text-slate-500 border border-slate-200";
					const labelClass = isCompleted
						? "text-[var(--navy)]"
						: isActive
							? "text-amber-700"
							: "text-muted-foreground";
					return (
						<div key={s} className="flex flex-1 items-center">
							<div className="flex flex-col items-center gap-1.5">
								<div
									className={`flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${bubbleClass}`}
								>
									{isCompleted ? <Check className="size-4 stroke-[3]" /> : s}
								</div>
								<span
									className={`whitespace-nowrap text-xs font-bold ${labelClass}`}
								>
									{STEP_LABELS[idx]}
								</span>
							</div>
							{idx < 2 ? (
								<div
									className={`mx-2 mb-5 h-0.5 flex-1 rounded-full transition-all duration-500 ${
										s < current ? "bg-[var(--navy)]" : "bg-slate-200"
									}`}
								/>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function SurveyPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");

	const [status, setStatus] = useState("NON_ASN");
	const [nama, setNama] = useState("");
	const [nip, setNip] = useState("");
	const [jk, setJk] = useState("L");
	const [umur, setUmur] = useState(25);
	const [pendidikan, setPendidikan] = useState("SMA");
	const [pekerjaan, setPekerjaan] = useState("LAINNYA");
	const [layananId, setLayananId] = useState(0);
	const [saran, setSaran] = useState("");
	const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>(
		{},
	);

	const { data: formsList = [] } = useQuery({
		queryKey: ["forms-active"],
		queryFn: () => getForms(),
	});
	const activeForm = formsList.find((f) => f.active === 1);
	const formId = activeForm?.formId ?? 0;

	const { data: questions = [] } = useQuery({
		queryKey: ["questions-survey", formId],
		queryFn: () => getQuestionsByFormId({ data: formId }),
		enabled: formId > 0,
	});

	const { data: layananList = [] } = useQuery({
		queryKey: ["layanan-active"],
		queryFn: () => getActiveLayanan(),
	});

	const submitMut = useMutation({
		mutationFn: submitSurvey,
		onSuccess: () => {
			setStep(3);
		},
		onError: (err) => {
			setError(err instanceof Error ? err.message : "Gagal menyimpan survey.");
		},
	});

	function handleNextStep() {
		if (!nama.trim()) {
			setError("Nama wajib diisi");
			return;
		}
		if (!layananId) {
			setError("Pilih layanan");
			return;
		}
		setError("");
		setStep(2);
	}

	function handleSubmit() {
		const activeQuestions = questions.filter((q) => q.active === "1");
		const allAnswered = activeQuestions.every(
			(q) => surveyAnswers[q.formQuestionId] != null,
		);
		if (!allAnswered) {
			setError("Jawab semua pertanyaan.");
			return;
		}
		setError("");
		submitMut.mutate({
			data: {
				formId,
				layananId,
				status,
				nama,
				nip: nip || undefined,
				jk,
				umur,
				pendidikan,
				pekerjaan,
				saran: saran || undefined,
				answers: Object.entries(surveyAnswers).map(([qId, val]) => ({
					formQuestionId: Number(qId),
					value: val,
				})),
			},
		});
	}

	const activeQuestions = questions.filter((q) => q.active === "1");
	const answeredCount = activeQuestions.filter(
		(q) => surveyAnswers[q.formQuestionId] != null,
	).length;
	const totalQuestions = activeQuestions.length;
	const progressPct =
		totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />
			<div className="container mx-auto max-w-2xl flex-1 px-4 py-8">
				<StepIndicator current={step} />

				{step === 1 && (
					<Card className="overflow-hidden border-t-4 border-t-[var(--amber)] border-x border-b border-slate-200 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="grid size-10 place-items-center rounded-lg bg-[var(--navy)] text-[var(--amber)]">
									<User className="size-5" />
								</div>
								<div>
									<CardTitle className="text-base font-extrabold text-[var(--navy)]">
										Informasi Responden
									</CardTitle>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Lengkapi data diri Anda untuk melanjutkan
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Informasi Pribadi
								</p>
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Status
									</Label>
									<Select value={status} onValueChange={setStatus}>
										<SelectTrigger className="min-h-[44px] w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(STATUS).map(([k, v]) => (
												<SelectItem key={k} value={k}>
													{v}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{status === "ASN" && (
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											NIP
										</Label>
										<Input
											value={nip}
											onChange={(e) => setNip(e.target.value)}
											placeholder="Masukkan NIP"
											className="min-h-[44px]"
										/>
									</div>
								)}
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Nama Lengkap{" "}
										<span className="text-[var(--red)]">*</span>
									</Label>
									<Input
										value={nama}
										onChange={(e) => setNama(e.target.value)}
										placeholder="Masukkan nama lengkap"
										className="min-h-[44px]"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Jenis Kelamin
										</Label>
										<Select value={jk} onValueChange={setJk}>
											<SelectTrigger className="min-h-[44px] w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(JK).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Umur
										</Label>
										<Input
											type="number"
											value={umur}
											onChange={(e) => setUmur(Number(e.target.value))}
											className="min-h-[44px]"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Pendidikan
										</Label>
										<Select value={pendidikan} onValueChange={setPendidikan}>
											<SelectTrigger className="min-h-[44px] w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(PENDIDIKAN).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Pekerjaan
										</Label>
										<Select value={pekerjaan} onValueChange={setPekerjaan}>
											<SelectTrigger className="min-h-[44px] w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(PEKERJAAN).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Layanan yang Dinilai
								</p>
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Layanan <span className="text-[var(--red)]">*</span>
									</Label>
									<Select
										value={layananId ? String(layananId) : ""}
										onValueChange={(v) => setLayananId(Number(v))}
									>
										<SelectTrigger className="min-h-[44px] w-full">
											<SelectValue placeholder="Pilih layanan..." />
										</SelectTrigger>
										<SelectContent>
											{layananList.map((l) => (
												<SelectItem
													key={l.layananId}
													value={String(l.layananId)}
												>
													{l.nama}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{error && (
								<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
									<p className="text-sm font-medium text-[var(--red)]">
										{error}
									</p>
								</div>
							)}
							<Button
								onClick={handleNextStep}
								className="min-h-[44px] w-full bg-[var(--navy)] font-bold text-white hover:bg-[var(--navy-2)]"
							>
								Lanjut ke Survey →
							</Button>
						</CardContent>
					</Card>
				)}

				{step === 2 && (
					<Card className="overflow-hidden border-t-4 border-t-[var(--amber)] border-x border-b border-slate-200 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="grid size-10 place-items-center rounded-lg bg-[var(--navy)] text-[var(--amber)]">
									<ClipboardList className="size-5" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-base font-extrabold text-[var(--navy)]">
										{activeForm?.name ?? "Survey"}
									</CardTitle>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{answeredCount} dari {totalQuestions} pertanyaan dijawab
									</p>
								</div>
							</div>
							<div className="mt-3 space-y-1">
								<div className="flex justify-between text-[10px] font-bold text-muted-foreground">
									<span>Progress</span>
									<span className="text-[var(--navy)]">
										{Math.round(progressPct)}% selesai
									</span>
								</div>
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full rounded-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] transition-all duration-500"
										style={{ width: `${progressPct}%` }}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{activeQuestions.map((q, idx) => (
								<div
									key={q.formQuestionId}
									className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
								>
									<div className="flex gap-3">
										<span className="grid size-6 shrink-0 place-items-center rounded-md bg-[var(--amber-soft)] text-xs font-black text-amber-800">
											{idx + 1}
										</span>
										<p className="pt-0.5 text-sm font-semibold leading-relaxed text-[var(--navy)]">
											{q.text}
										</p>
									</div>
									<RadioGroup
										value={
											surveyAnswers[q.formQuestionId] != null
												? String(surveyAnswers[q.formQuestionId])
												: undefined
										}
										onValueChange={(val) =>
											setSurveyAnswers((prev) => ({
												...prev,
												[q.formQuestionId]: Number(val),
											}))
										}
										className="grid grid-cols-2 gap-2"
									>
										{[1, 2, 3, 4].map((val) => {
											const isSelected =
												surveyAnswers[q.formQuestionId] === val;
											return (
												<Label
													key={val}
													className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border-2 p-3 font-normal transition-all duration-200 ${
														isSelected
															? "border-[var(--amber)] bg-[var(--amber-soft)] font-bold text-amber-900"
															: "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
													}`}
												>
													<RadioGroupItem
														value={String(val)}
														className={
															isSelected
																? "border-[var(--amber)] text-[var(--amber)]"
																: ""
														}
													/>
													<span className="text-sm font-medium">
														{val} — {ANSWER_POIN[val]}
													</span>
												</Label>
											);
										})}
									</RadioGroup>
								</div>
							))}

							<div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<Label
									htmlFor="saran-textarea"
									className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]"
								>
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Saran &amp; Masukan{" "}
									<span className="ml-1 font-medium normal-case tracking-normal text-muted-foreground">
										(opsional)
									</span>
								</Label>
								<Textarea
									id="saran-textarea"
									value={saran}
									onChange={(e) => setSaran(e.target.value)}
									placeholder="Tuliskan saran atau masukan Anda..."
									className="min-h-[100px] resize-none"
								/>
							</div>

							{error && (
								<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
									<p className="text-sm font-medium text-[var(--red)]">
										{error}
									</p>
								</div>
							)}

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => setStep(1)}
									className="min-h-[44px] border-slate-200 px-5 font-bold text-[var(--navy)]"
								>
									← Kembali
								</Button>
								<Button
									onClick={handleSubmit}
									className="min-h-[44px] flex-1 bg-[var(--navy)] font-bold text-white hover:bg-[var(--navy-2)] disabled:opacity-60"
									disabled={submitMut.isPending}
								>
									{submitMut.isPending ? "Menyimpan..." : "Kirim Survey →"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{step === 3 && (
					<Card className="overflow-hidden border-t-4 border-t-emerald-500 border-x border-b border-slate-200 shadow-sm">
						<div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-8 pt-12 pb-6 text-center">
							<div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-200">
								<CheckCircle2 className="size-10 text-white" strokeWidth={2} />
							</div>
							<h2 className="mt-5 text-2xl font-black text-[var(--navy)]">
								Terima Kasih!
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Survey Anda berhasil terekam dalam sistem IKM
							</p>
						</div>
						<CardContent className="space-y-4 py-7 text-center">
							<p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-700">
								Masukan Anda sangat berarti untuk meningkatkan kualitas
								pelayanan Diskominfo Kabupaten Tabalong. Hasil agregat akan
								tampil di halaman Hasil IKM.
							</p>
							<div className="flex flex-wrap justify-center gap-3">
								<Button
									variant="outline"
									onClick={() => navigate({ to: "/guest/ikm" })}
									className="min-h-[44px] border-slate-200 px-5 font-bold text-[var(--navy)]"
								>
									Lihat Hasil IKM
								</Button>
								<Button
									onClick={() => navigate({ to: "/" })}
									className="min-h-[44px] bg-[var(--navy)] px-6 font-bold text-white hover:bg-[var(--navy-2)]"
								>
									Kembali ke Beranda
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			<PublicFooter />
		</div>
	);
}
```

**Notes:**
- Hapus `cn()` usage di step indicator — refactor to template literal for clarity.
- `border-t-4 border-t-[var(--amber)]` for steps 1-2 (wizard accent), `border-t-emerald-500` for step 3 (success semantic).
- Removed `gradient-text` className from step 3 (sudah tidak ada utility ini).
- Step 3 sekarang ada **2 buttons** (Lihat Hasil IKM + Kembali ke Beranda) — perbaikan UX dibanding 1 button sebelumnya.

- [ ] **Step 2: Run lint+format**

Run: `pnpm check`
Expected: no errors.

- [ ] **Step 3: Run type check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run`
Expected: all pass.

- [ ] **Step 5: Dev server visual & flow check**

Open: `http://localhost:3000/guest/survey`
Verify Step 1:
- Step indicator: bubble 1 amber active dengan ring, 2 & 3 gray
- Card border-top amber tebal
- Form groups dengan kicker biru "Informasi Pribadi" / "Layanan yang Dinilai"
- Submit "Lanjut ke Survey →" navy button

Submit step 1 → verify Step 2:
- Bubble 1 navy done dengan check, 2 amber active, 3 gray
- Progress bar gradient navy→blue
- Question cards dengan q-num bubble amber
- Radio option SELECTED = amber border + amber-soft bg
- Saran textarea dengan kicker biru

Submit step 2 → verify Step 3:
- All bubbles navy done dengan check
- Card border-top **green** (semantic, bukan amber)
- Green check icon
- 2 buttons: "Lihat Hasil IKM" outline + "Kembali ke Beranda" navy

- [ ] **Step 6: Commit**

```bash
git add src/routes/guest/survey.index.tsx
git commit -m "feat(survey): redesign wizard with Kominfo palette and amber active state"
```

---

## Final Verification

After all 11 tasks complete:

- [ ] **Run full test suite:** `pnpm test`
  Expected: all pass (8 tests from 4 new components).

- [ ] **Run lint:** `pnpm check`
  Expected: no errors.

- [ ] **Run type check:** `pnpm exec tsc --noEmit`
  Expected: no errors.

- [ ] **Build production:** `pnpm build`
  Expected: success.

- [ ] **Visual regression spot-check** di `http://localhost:3000`:
  - `/` — landing dengan hero + LiveDataCard, stats banner, feature cards, etc.
  - `/guest/ikm` — overall card, stat cards, table, bar chart
  - `/guest/survey` — wizard flow 1 → 2 → 3
  - Mobile responsive (≤ 768px) — navbar hamburger, hero stack, cards single-column
  - No references to old utilities di public scope:
    Run: `grep -rn "glass-card\|gradient-hero\|gradient-text" src/routes/index.tsx src/routes/guest/ikm.tsx src/routes/guest/survey.index.tsx src/components/public-navbar.tsx src/components/public-footer.tsx`
    Expected: zero matches. (Admin pages & `guest/survey.$formId.tsx` may still use them — out of scope.)

- [ ] **Cleanup superpowers brainstorm workspace** (optional, sudah di-gitignore):
  Run: `/Users/muhammadwildaniskandar/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh /Users/muhammadwildaniskandar/Projects/IKM_Diskominfo/ikm-new/.superpowers/brainstorm/31604-1778803199`

---

## Self-Review Notes (already applied)

- ✅ Spec coverage: semua section 1-12 dari spec ter-cover di task. Open questions (section 13) di-flag sebagai out-of-scope.
- ✅ Placeholder scan: no TBD/TODO/vague refs.
- ✅ Type consistency: `Accent` type di `FeatureCard`, `LiveDataCardProps` shape, `getMutuBadgeClasses`/`getMutuFillHex` signatures konsisten.
- ✅ Admin pages (`src/routes/admin/*`) sengaja tidak disertakan — spec section 12 flags as out-of-scope.
- ✅ Existing utility classes `glass-card`/`gradient-hero`/`gradient-text` di-remap di Task 1 (bukan dihapus) — admin pages dan `guest/survey.$formId.tsx` (keduanya out-of-scope) akan tetap berfungsi dengan look baru yang minimal-disruptive.
