import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Network,
  Smartphone,
  TrendingUp,
  LineChart,
  Activity,
  Dice5,
  Award,
  Globe2,
  Sparkles,
  Layers,
  FileBarChart2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const groups = (t: (k: any) => string) => [
  {
    label: t("nav_dashboard"),
    items: [{ to: "/", label: t("nav_dashboard"), icon: LayoutDashboard }],
  },
  {
    label: t("section_analytics"),
    items: [
      { to: "/infrastructure", label: t("nav_infra"), icon: Network },
      { to: "/digital-services", label: t("nav_digital"), icon: Smartphone },
      { to: "/malmquist", label: t("nav_malmquist"), icon: TrendingUp },
      { to: "/ols", label: t("nav_ols"), icon: LineChart },
      { to: "/garch", label: t("nav_garch"), icon: Activity },
      { to: "/monte-carlo", label: t("nav_mc"), icon: Dice5 },
    ],
  },
  {
    label: t("section_strategic"),
    items: [
      { to: "/dmm", label: t("nav_dmm"), icon: Award },
      { to: "/regional", label: t("nav_regional"), icon: Globe2 },
      { to: "/forecast", label: t("nav_forecast"), icon: Sparkles },
    ],
  },
  {
    label: t("section_system"),
    items: [
      { to: "/architecture", label: t("nav_arch"), icon: Layers },
      { to: "/report", label: t("nav_report"), icon: FileBarChart2 },
    ],
  },
];

export function AppSidebar() {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-gold flex items-center justify-center font-bold text-gold-foreground">
            T
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight">{t("brand")}</div>
            <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">
              {t("brand_sub")}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {groups(t).map((g) => (
          <div key={g.label}>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 px-2 mb-1.5 font-semibold">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => setLang(lang === "uz" ? "en" : "uz")}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-sidebar-accent/50 hover:bg-sidebar-accent text-sm transition-colors"
        >
          <span className="text-sidebar-foreground/70">Language</span>
          <span className="font-semibold text-gold">{lang.toUpperCase()} → {t("lang_toggle")}</span>
        </button>
        <div className="text-[10px] text-sidebar-foreground/40 px-2 leading-relaxed">
          DGU ro'yxati · 2024<br />ORCID 0000-0003-1409-0716
        </div>
      </div>
    </aside>
  );
}
