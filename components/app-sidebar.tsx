"use client";

import * as React from "react";
import {
  IconAlertTriangle,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileSearch,
  IconHelp,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconUsers,
  IconReport,
  IconAdjustments,
  IconBell,
  IconShieldLock,
  IconBrain,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Sarah Chen",
    email: "s.chen@fraudshield.io",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: IconDashboard,
    },
    // {
    //   title: "Fraud Alerts",
    //   url: "#",
    //   icon: IconAlertTriangle,
    // },
    {
      title: "Investigations",
      url: "/dashboard/investigations",
      icon: IconFileSearch,
    },
    {
      title: "Profile Analytics",
      url: "/dashboard/profile-analytics",
      icon: IconChartBar,
    },
    {
      title: "Rules Management",
      url: "/dashboard/rules",
      icon: IconAdjustments,
    },
    {
      title: "AI Models",
      url: "/dashboard/models",
      icon: IconBrain,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Alert Rules",
      url: "#",
      icon: IconBell,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search Transactions",
      url: "#",
      icon: IconSearch,
    },
  ],

};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconShieldCheck className="!size-5" />
                <span className="text-base font-semibold">
                  FraudShield Pro
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
