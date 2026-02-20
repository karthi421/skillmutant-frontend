import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [active, setActive] = useState("home");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
