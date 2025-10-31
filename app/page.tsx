import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const Kalender2026: ComponentType<any> = dynamic(
  () =>
    import("../components/Kalender2026").then(
      (mod) => (mod as any).default as ComponentType<any>
    ),
  { ssr: false }
);

export default function Page() {
  return <Kalender2026 />;
}
