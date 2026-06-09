import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { makeStore, type AppStore } from "@/store";
import { setUser, type AuthUser } from "@/store/slices/authSlice";
import trMessages from "@/messages/tr.json";
import enMessages from "@/messages/en.json";

const messages = { tr: trMessages, en: enMessages };

type Options = Omit<RenderOptions, "wrapper"> & {
  locale?: "tr" | "en";
  user?: AuthUser | null;
  store?: AppStore;
};

export function renderWithProviders(
  ui: ReactElement,
  { locale = "tr", user = null, store, ...rest }: Options = {},
) {
  const reduxStore = store ?? makeStore();
  reduxStore.dispatch(setUser(user));

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={reduxStore}>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          {children}
        </NextIntlClientProvider>
      </Provider>
    );
  }

  return { store: reduxStore, ...render(ui, { wrapper: Wrapper, ...rest }) };
}

export const fullAccessUser: AuthUser = {
  id: "user-1",
  email: "admin@uplide.test",
  role: "full_access",
};

export const readerUser: AuthUser = {
  id: "user-2",
  email: "reader@uplide.test",
  role: "reader",
};
