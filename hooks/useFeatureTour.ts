"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gandiva_tour_seen_v1";

export function useFeatureTour(totalSteps: number = 5) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const hasSeenTour = localStorage.getItem(STORAGE_KEY);
      if (!hasSeenTour) {
        // Beri jeda halus agar komponen halaman ter-render sempurna sebelum spotlight aktif
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 750);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback jika localStorage tidak dapat diakses (misal mode private browser strict)
    }
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Abaikan error localStorage
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      closeTour();
      return prev;
    });
  }, [totalSteps, closeTour]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);

  return {
    isTourOpen: hasMounted && isTourOpen,
    currentStep,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    goToStep,
  };
}
