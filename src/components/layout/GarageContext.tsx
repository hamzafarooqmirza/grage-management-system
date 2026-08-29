"use client";

import { createContext, useContext } from "react";
import type { Garage } from "@/lib/types";

interface GarageContextValue {
  garages: Garage[];
  currentGarageId: string;
}

const GarageContext = createContext<GarageContextValue | null>(null);

export function GarageProvider({
  garages,
  currentGarageId,
  children,
}: {
  garages: Garage[];
  currentGarageId: string;
  children: React.ReactNode;
}) {
  return (
    <GarageContext.Provider value={{ garages, currentGarageId }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return ctx;
}
