"use client";

import { createContext, useContext, useState, useCallback } from "react";
import LeadModal from "@/components/LeadModal";

type ModalCtx = {
  open: (preset?: string) => void;
  close: () => void;
};

const Ctx = createContext<ModalCtx | null>(null);

export function useModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<string | undefined>();

  const open = useCallback((p?: string) => {
    setPreset(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <LeadModal isOpen={isOpen} onClose={close} preset={preset} />
    </Ctx.Provider>
  );
}
