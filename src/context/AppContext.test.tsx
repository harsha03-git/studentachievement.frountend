import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProvider, useApp } from "@/context/AppContext";
import React from "react";

// ─── Mock global fetch ─────────────────────────────────────────────────────────
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    })
  );
});

// ─── Helper consumer component ────────────────────────────────────────────────
const RoleDisplay = () => {
  const { user, logout } = useApp();
  return (
    <div>
      <span data-testid="role">{user?.role ?? "none"}</span>
      <span data-testid="name">{user?.name ?? "none"}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("AppContext", () => {
  it("starts with no user (unauthenticated)", () => {
    render(
      <AppProvider>
        <RoleDisplay />
      </AppProvider>
    );
    expect(screen.getByTestId("role").textContent).toBe("none");
  });

  it("login as admin sets user role and name immediately", async () => {
    const AdminLogin = () => {
      const { user, login } = useApp();
      return (
        <div>
          <button onClick={() => login("admin", "admin@school.com")}>
            Login Admin
          </button>
          <span data-testid="role">{user?.role ?? "none"}</span>
          <span data-testid="email">{user?.email ?? "none"}</span>
        </div>
      );
    };

    render(
      <AppProvider>
        <AdminLogin />
      </AppProvider>
    );

    await userEvent.click(screen.getByText("Login Admin"));

    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("admin")
    );
    expect(screen.getByTestId("email").textContent).toBe("admin@school.com");
  });

  it("logout clears the user", async () => {
    const Component = () => {
      const { user, login, logout } = useApp();
      return (
        <div>
          <button onClick={() => login("admin", "admin@school.com")}>Login</button>
          <button onClick={logout}>Logout</button>
          <span data-testid="role">{user?.role ?? "none"}</span>
        </div>
      );
    };

    render(
      <AppProvider>
        <Component />
      </AppProvider>
    );

    await userEvent.click(screen.getByText("Login"));
    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("admin")
    );

    await userEvent.click(screen.getByText("Logout"));
    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("none")
    );
  });

  it("login as teacher calls backend /api/auth/login", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "t1",
        name: "Prof. Bob",
        email: "bob@school.com",
        role: "teacher",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const Component = () => {
      const { user, login } = useApp();
      return (
        <div>
          <button onClick={() => login("teacher", "bob@school.com")}>Login Teacher</button>
          <span data-testid="name">{user?.name ?? "none"}</span>
        </div>
      );
    };

    render(
      <AppProvider>
        <Component />
      </AppProvider>
    );

    await userEvent.click(screen.getByText("Login Teacher"));

    await waitFor(() =>
      expect(screen.getByTestId("name").textContent).toBe("Prof. Bob")
    );
    // Verify it called fetch with the login endpoint
    const calls = (mockFetch as ReturnType<typeof vi.fn>).mock.calls.map(
      (c: [string, ...unknown[]]) => c[0]
    );
    expect(calls.some((url: string) => url.includes("/api/auth/login"))).toBe(true);
  });

  it("useApp throws when used outside AppProvider", () => {
    const Bad = () => {
      useApp();
      return null;
    };
    expect(() => render(<Bad />)).toThrow("useApp must be used within AppProvider");
  });
});
