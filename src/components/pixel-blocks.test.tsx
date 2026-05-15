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
