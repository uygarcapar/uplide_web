"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { makeStore } from "./index";
import { setTheme } from "./slices/uiSlice";
import { setUser, type AuthUser } from "./slices/authSlice";

type Props = {
  children: React.ReactNode;
  initialUser: AuthUser | null;
};

export function Providers({ children, initialUser }: Props) {
  const [store] = useState(() => {
    const s = makeStore();
    s.dispatch(setUser(initialUser));
    return s;
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      stored === "dark" || stored === "light"
        ? stored
        : prefersDark
          ? "dark"
          : "light";
    store.dispatch(setTheme(initial));
    document.documentElement.dataset.theme = initial;
  }, [store]);

  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right" />
    </Provider>
  );
}
