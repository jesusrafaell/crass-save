"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { saveScrollPosition } from "./index";
import { usePageTransitionContext } from "@/context/PageTransitionContext";

export default function NewLink({
  link,
  className,
}: {
  link: { path: string; text: string };
  className?: string;
}) {
  const { isTransitionActive, setRoutingPageOffset } =
    usePageTransitionContext();
  const pathname = usePathname();

  return (
    <Link
      key={link.path}
      onClick={(e) => {
        if (isTransitionActive) e.preventDefault();
        saveScrollPosition(pathname, setRoutingPageOffset);
      }}
      className={`rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase text-black ${className}`}
      href={link.path}
    >
      {link.text}
    </Link>
  );
}
