"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, LayoutDashboard, PenSquare, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/composer", icon: PenSquare, label: "Composer" },
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/phrases", icon: BookText, label: "Phrases" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" size="icon" className="shrink-0 size-8" asChild>
              <Link href="/dashboard">
                <Logo className="size-5 fill-sidebar-primary" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-sidebar-primary truncate group-data-[collapsible=icon]:hidden">
              SalesPilot AI
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="justify-start"
                  tooltip={{children: item.label}}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:hidden">
          <SidebarTrigger />
           <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="size-5 fill-primary" />
              <h1 className="text-lg font-semibold text-primary">SalesPilot AI</h1>
           </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}