"use client";

import { useModal } from "@/providers/ModalProvider";
import Magnetic from "@/components/Magnetic";
import { ArrowUpRight } from "lucide-react";

export default function CTAButton({
  children = "Заказать мероприятие",
  preset,
  variant = "primary",
  arrow = false,
  magnetic = true,
  className = "",
}: {
  children?: React.ReactNode;
  preset?: string;
  variant?: "primary" | "ghost" | "light";
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
}) {
  const { open } = useModal();
  const cls = `btn btn-${variant} ${className}`;
  const btn = (
    <button className={cls} onClick={() => open(preset)}>
      {children}
      {arrow && <ArrowUpRight size={18} strokeWidth={2} />}
    </button>
  );
  return magnetic ? <Magnetic strength={0.3}>{btn}</Magnetic> : btn;
}
