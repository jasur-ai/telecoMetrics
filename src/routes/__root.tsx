import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "@/lib/i18n";
import { AppSidebar } from "@/components/app-sidebar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TelecoMetrics.uz — O'zbektelekom Raqamli Iqtisodiyot Tahlil Platformasi" },
      { name: "description", content: "Ilmiy-analitik platforma: DEA-CCR, Malmquist TFP, OLS, GARCH, Monte-Carlo va LSTM asosida O'zbektelekom JSC raqamli transformatsiya samaradorligini baholash." },
      { property: "og:title", content: "TelecoMetrics.uz — O'zbektelekom Raqamli Iqtisodiyot Tahlil Platformasi" },
      { name: "twitter:title", content: "TelecoMetrics.uz — O'zbektelekom Raqamli Iqtisodiyot Tahlil Platformasi" },
      { property: "og:description", content: "Ilmiy-analitik platforma: DEA-CCR, Malmquist TFP, OLS, GARCH, Monte-Carlo va LSTM asosida O'zbektelekom JSC raqamli transformatsiya samaradorligini baholash." },
      { name: "twitter:description", content: "Ilmiy-analitik platforma: DEA-CCR, Malmquist TFP, OLS, GARCH, Monte-Carlo va LSTM asosida O'zbektelekom JSC raqamli transformatsiya samaradorligini baholash." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/381e8344-73a5-4b81-9a5a-d635ad21b978/id-preview-d607a102--63a21e14-4ac0-40af-80d2-e3f1ac090bdf.lovable.app-1781943976668.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/381e8344-73a5-4b81-9a5a-d635ad21b978/id-preview-d607a102--63a21e14-4ac0-40af-80d2-e3f1ac090bdf.lovable.app-1781943976668.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-6 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </I18nProvider>
    </QueryClientProvider>
  );
}
