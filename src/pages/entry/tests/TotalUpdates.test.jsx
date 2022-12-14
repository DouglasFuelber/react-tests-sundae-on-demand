import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
	render(<Options optionType="scoops" />);

	const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
	expect(scoopsSubtotal).toHaveTextContent("0.00");

	const vanillaInput = await screen.findByRole("spinbutton", {
		name: "Vanilla",
	});
	userEvent.clear(vanillaInput);
	userEvent.type(vanillaInput, "1");
	expect(scoopsSubtotal).toHaveTextContent("2.00");

	const chocolateInput = await screen.findByRole("spinbutton", {
		name: "Chocolate",
	});
	userEvent.clear(chocolateInput);
	userEvent.type(chocolateInput, "2");
	expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when toppings change", async () => {
	render(<Options optionType="toppings" />);

	const toppingsSubtotal = screen.getByText("Toppings total: $", { exact: false });
	expect(toppingsSubtotal).toHaveTextContent("0.00");

	const cherryCheckbox = await screen.findByRole("checkbox", {
		name: "Cherries",
	});

	userEvent.click(cherryCheckbox);
	expect(toppingsSubtotal).toHaveTextContent("1.50");

	const hotFudgeCheckbox = await screen.findByRole("checkbox", {
		name: "Hot fudge",
	});

	userEvent.click(hotFudgeCheckbox);
	expect(toppingsSubtotal).toHaveTextContent("3.00");

	userEvent.click(hotFudgeCheckbox);
	expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
	test("grand total updates properly if scoop is added first", async () => {
		render(<OrderEntry />);

		const grandTotal = screen.getByRole("heading", {
			name: /grand total: \$/i,
		});

		expect(grandTotal).toHaveTextContent("0.00");

		const vanillaInput = await screen.findByRole("spinbutton", {
			name: "Vanilla",
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, "2");

		expect(grandTotal).toHaveTextContent("4.00");

		const cherryCheckbox = await screen.findByRole("checkbox", {
			name: "Cherries",
		});
		userEvent.click(cherryCheckbox);

		expect(grandTotal).toHaveTextContent("5.50");
	});

	test("grand total updates properly if topping is added first", async () => {
		render(<OrderEntry />);

		const grandTotal = screen.getByRole("heading", {
			name: /grand total: \$/i,
		});

		expect(grandTotal).toHaveTextContent("0.00");

		const cherryCheckbox = await screen.findByRole("checkbox", {
			name: "Cherries",
		});
		userEvent.click(cherryCheckbox);

		expect(grandTotal).toHaveTextContent("1.50");

		const vanillaInput = await screen.findByRole("spinbutton", {
			name: "Vanilla",
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, "3");

		expect(grandTotal).toHaveTextContent("7.50");
	});

	test("grand total updates properly if item is removed", async () => {
		render(<OrderEntry />);

		const grandTotal = screen.getByRole("heading", {
			name: /grand total: \$/i,
		});

		expect(grandTotal).toHaveTextContent("0.00");

		const cherryCheckbox = await screen.findByRole("checkbox", {
			name: "Cherries",
		});
		userEvent.click(cherryCheckbox);

		expect(grandTotal).toHaveTextContent("1.50");

		const vanillaInput = await screen.findByRole("spinbutton", {
			name: "Vanilla",
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, "3");

		expect(grandTotal).toHaveTextContent("7.50");

		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, "1");

		expect(grandTotal).toHaveTextContent("3.50");

		userEvent.click(cherryCheckbox);

		expect(grandTotal).toHaveTextContent("2.00");
	});
});
