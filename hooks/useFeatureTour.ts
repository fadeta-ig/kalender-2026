"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gandiva_tour_seen_v1";

export function useFeatureTour(totalSteps: number = 7) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
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

  const closeTour = useCallback((dontShowAgain: boolean = true) => {
    setIsTourOpen(false);
    try {
      if (dontShowAgain) {
        localStorage.setItem(STORAGE_KEY, "true");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Abaikan error localStorage
    }
  }, []);

  const nextStep = useCallback((dontShowAgain: boolean = true) => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      closeTour(dontShowAgain);
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
    isTourOpen,
    currentStep,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    goToStep,
  };
}
