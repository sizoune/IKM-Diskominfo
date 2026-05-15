import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LiveDataCard } from "./live-data-card";

describe("LiveDataCard", () => {
	it("renders score, year, mutu, and scale", () => {
		render(<LiveDataCard year={2025} score={3.42} mutuLabel="Mutu B · Baik" />);
		expect(screen.getByText(/2025/)).toBeInTheDocument();
		expect(screen.getByText("3.42")).toBeInTheDocument();
		expect(screen.getByText("Mutu B · Baik")).toBeInTheDocument();
		expect(screen.getByText(/0 — 4.00 skala/)).toBeInTheDocument();
		expect(screen.getByText("LIVE")).toBeInTheDocument();
	});

	it("renders progress bar based on score", () => {
		const { container } = render(
			<LiveDataCard year={2025} score={2.0} mutuLabel="Mutu C" />,
		);
		const fill = container.querySelector(
			'[data-testid="bar-fill"]',
		) as HTMLElement;
		expect(fill.style.width).toBe("50%");
	});

	it("shows placeholder dash when score is null", () => {
		const { container } = render(
			<LiveDataCard year={2025} score={null} mutuLabel="—" />,
		);
		const scoreDisplay = container.querySelector(
			'[data-testid="score-display"]',
		) as HTMLElement;
		expect(scoreDisplay).toHaveTextContent("—");
	});
});
