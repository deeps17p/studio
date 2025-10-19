
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PenSquare, FileText, ChevronsUpDown, MessageSquare } from "lucide-react";

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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/composer", icon: PenSquare, label: "Composer" },
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/whatsapp-followup", icon: MessageSquare, label: "Follow-up" },
];

type ProductInfo = {
  name: string;
  description: string;
};


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [productInfo, setProductInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChangeProduct = () => {
    setProductInfo(null);
    router.push('/');
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" size="icon" className="shrink-0 size-10" asChild>
              <Link href="/dashboard">
                <Logo className="size-6 fill-sidebar-primary" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-sidebar-primary truncate group-data-[collapsible=icon]:hidden">
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
                  isActive={pathname.startsWith(item.href)}
                  className="justify-start text-base h-12"
                  tooltip={{children: item.label}}
                  size="lg"
                >
                  <Link href={item.href}>
                    <item.icon className="size-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto group-data-[collapsible=icon]:hidden">
          <Separator className="my-2" />
          <div className="p-4 space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Customized for</p>
              <div className="font-semibold text-foreground">{isClient ? productInfo?.name || '...' : '...'}</div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="outline" className="w-full">
                  Change Product
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change Product?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your current product context and return you to the onboarding screen. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleChangeProduct}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:hidden">
          <SidebarTrigger />
           <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="size-6 fill-primary" />
              <h1 className="text-xl font-semibold text-primary">SalesPilot AI</h1>
           </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
