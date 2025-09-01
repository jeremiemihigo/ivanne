"use client";

import {
  DatabaseBackup,
  Factory,
  Frame,
  LayoutDashboard,
  PieChart,
  Settings,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Rapport",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Stock individuel",
          url: "/stock_individuel",
        },
       
        {
          title: "Rapport commercial",
          url: "/rapport_commercial",
        },
        {
          title: "Modification stock",
          url: "/ajustage",
        },
      ],
    },
    {
      title: "Autres",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "Utilisateurs",
          url: "/utilisateurs",
        },
        {
          title: "Fournisseur/clients",
          url: "/tiers",
        },
        {
          title: "Synchronisation",
          url: "/synchronisation",
        },
        {
          title: "Configuration",
          url: "/configuration",
        },
        {
          title: "Taux de change",
          url: "/taux",
        },
        {
          title: "Dépense",
          url: "/depense",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Tableau de bord",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Produits",
      url: "/produits",
      icon: Frame,
    },
    {
      name: "Approvisionnement",
      url: "/approvisionnement",
      icon: DatabaseBackup,
    },
    {
      name: "Stock",
      url: "/stock",
      icon: DatabaseBackup,
    },
    {
      name: "Ventes",
      url: "/ventes",
      icon: PieChart,
    },

    {
      name: "Factures",
      url: "/facture",
      icon: Factory,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
