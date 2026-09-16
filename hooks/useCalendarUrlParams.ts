import { useSyncExternalStore, useMemo, useState, useCallback } from "react";
import type { SupportedYear } from "@/data/holidays";
import type { LeaveStrategy } from "@/lib/leaveOptimizer";

function subscribeToUrlChanges(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
  };
}

function getClientUrlSearchSnapshot(): string {
  return window.location.search;
}

function getServerUrlSearchSnapshot(): string {
  return "";
}

interface ParsedUrlParams {
  year: SupportedYear;
  quota: number;
  strategy: LeaveStrategy;
  tab: "calendar" | "tips";
}

/**
 * Custom hook to safely parse URL query parameters for initial state synchronization
 * without triggering cascading renders or hydration mismatches.
 */
export function useCalendarUrlParams() {
  const search = useSyncExternalStore(
    subscribeToUrlChanges,
    getClientUrlSearchSnapshot,
    getServerUrlSearchSnapshot
  );

  const initialValues = useMemo<ParsedUrlParams>(() => {
    let year: SupportedYear = 2027;
    let quota = 5;
    let strategy: LeaveStrategy = "longest";
    let tab: "calendar" | "tips" = "calendar";

    if (!search) {
      return { year, quota, strategy, tab };
    }

    try {
      const params = new URLSearchParams(search);
      const urlYear = params.get("year");
      const urlQuota = params.get("quota");
      const urlStrategy = params.get("strategy");
      const urlTab = params.get("tab");

      if (urlYear === "2026" || urlYear === "2027") {
        year = Number(urlYear) as SupportedYear;
      }

      if (urlQuota) {
        const q = parseInt(urlQuota, 10);
        if (!isNaN(q) && q > 0 && q <= 30) {
          quota = q;
        }
      }

      if (urlStrategy === "longest" || urlStrategy === "frequent") {
        strategy = urlStrategy;
      }

      if (urlTab === "tips" || params.has("quota")) {
        tab = "tips";
      }
    } catch {
      // Fallback cleanly to default values
    }

    return { year, quota, strategy, tab };
  }, [search]);

  // Local overrides for interactive user state
  const [selectedYearOverride, setSelectedYearOverride] = useState<SupportedYear | null>(null);
  const [activeTabOverride, setActiveTabOverride] = useState<"calendar" | "tips" | null>(null);
  const [leaveQuotaOverride, setLeaveQuotaOverride] = useState<number | null>(null);
  const [leaveStrategyOverride, setLeaveStrategyOverride] = useState<LeaveStrategy | null>(null);

  const selectedYear = selectedYearOverride ?? initialValues.year;
  const activeTab = activeTabOverride ?? initialValues.tab;
  const leaveQuota = leaveQuotaOverride ?? initialValues.quota;
  const leaveStrategy = leaveStrategyOverride ?? initialValues.strategy;

  const setSelectedYear = useCallback((year: SupportedYear) => {
    setSelectedYearOverride(year);
  }, []);

  const setActiveTab = useCallback((tab: "calendar" | "tips") => {
    setActiveTabOverride(tab);
  }, []);

  const setLeaveQuota = useCallback((quota: number) => {
    setLeaveQuotaOverride(quota);
  }, []);

  const setLeaveStrategy = useCallback((strategy: LeaveStrategy) => {
    setLeaveStrategyOverride(strategy);
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    leaveQuota,
    setLeaveQuota,
    leaveStrategy,
    setLeaveStrategy,
  };
}
