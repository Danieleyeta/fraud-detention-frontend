"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSelector } from "./theme-selector";
import { ModeSwitcher } from "./mode-switcher";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/rules": "Rules Management",
  "/dashboard/alerts": "Fraud Alerts",
  "/dashboard/investigations": "Investigations",
  "/dashboard/profile-analytics": "Profile Analytics",
  "/dashboard/models": "AI Models Management",
};

export function SiteHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "FraudShield Pro";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
