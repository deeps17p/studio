import { AppShell } from "@/components/app-shell";

export default function PhrasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
