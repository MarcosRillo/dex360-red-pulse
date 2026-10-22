import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

const fetchMock = vi.fn();

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows the API error inline when the credentials are rejected", async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: "Email o contraseña incorrectos" }));
    render(<LoginForm />);

    await fillAndSubmit("gerencia@australmotors.test", "wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent("Email o contraseña incorrectos");
    expect(replace).not.toHaveBeenCalled();
  });

  it("disables the submit button with a pending label while the request runs", async () => {
    let resolve!: (response: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    render(<LoginForm />);

    await fillAndSubmit("gerencia@australmotors.test", "redpulse-demo");

    const pending = await screen.findByRole("button", { name: "Ingresando…" });
    expect(pending).toBeDisabled();

    resolve(jsonResponse(401, { error: "Email o contraseña incorrectos" }));
    expect(await screen.findByRole("button", { name: "Ingresar" })).toBeEnabled();
  });

  it("validates with the shared schema before calling the API", async () => {
    render(<LoginForm />);

    await fillAndSubmit("not-an-email", "x");

    expect(await screen.findByRole("alert")).toHaveTextContent("Ingresá un email válido");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("navigates to the dashboard and refreshes on success", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { id: "u1", name: "Valentina Ríos", email: "gerencia@australmotors.test", role: "gerencia" }),
    );
    render(<LoginForm />);

    await fillAndSubmit("gerencia@australmotors.test", "redpulse-demo");

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(refresh).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
