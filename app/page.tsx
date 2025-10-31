import dynamic from "next/dynamic";

const Kalender2026 = dynamic(() => import("../components/Kalender2026"), { ssr: false });

export default function Page() {
  return <Kalender2026 />;
}
