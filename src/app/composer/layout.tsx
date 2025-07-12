import { AppShell } from "@/components/app-shell";

export default function ComposerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
