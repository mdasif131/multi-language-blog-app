import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>hi</div>
      {children}
    </div>
  )
}
