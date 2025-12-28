"use client";

import { useRouter } from "next/navigation";

type DashboardButtonProps = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export default function DashboardButton({
  label,
  href,
  variant = "primary",
}: DashboardButtonProps) {
  const router = useRouter();

  const baseStyle =
    "w-full px-4 py-3 rounded-lg font-medium transition text-center";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
  };

  return (
    <button
      onClick={() => router.push(href)}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}
