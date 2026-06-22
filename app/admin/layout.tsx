import { AuthSync } from "@/components/admin/AuthSync";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthSync />
      {children}
    </>
  );
}
