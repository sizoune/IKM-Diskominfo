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
