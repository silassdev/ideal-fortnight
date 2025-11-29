import dynamic from "next/dynamic";
import React from "react";

const DashboardClient = dynamic(() => import("@/components/dashboard/Dashboard"), { ssr: false });

export default function Page() {
    return <DashboardClient />;
}
