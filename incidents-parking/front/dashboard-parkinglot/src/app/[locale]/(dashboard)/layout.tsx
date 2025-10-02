// "use client
import CommerceLayout from "@/components/layout/commerce";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommerceLayout>{children}</CommerceLayout>;
}
