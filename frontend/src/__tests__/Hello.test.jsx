import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HelloWorld from "../Hello";

vi.mock("../auth", () => ({
  authFetch: vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: "Hello from FastAPI!" }),
    }),
  ),
}));

vi.mock("../context/BackendContext", () => ({
  useBackendStatus: () => ({ isConnected: true }),
}));

describe("HelloWorld", () => {
  it("renders the backend message", async () => {
    render(<HelloWorld />);

    await waitFor(() => {
      expect(screen.getByText("Hello from FastAPI!")).toBeInTheDocument();
    });
  });
});
