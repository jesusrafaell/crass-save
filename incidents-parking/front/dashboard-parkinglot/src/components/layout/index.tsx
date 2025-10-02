"use client";
import React, { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import { TransitionProvider } from "@/context/PageTransitionContext";
import PageTransition from "../PageTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <TransitionProvider>
      <main className="bg-background text-foreground dark">
        <PageTransition>{children}</PageTransition>
        <NextTopLoader
          color="#2299DD"
          height={3}
          showSpinner={false}
          easing="ease"
          speed={400}
          zIndex={60}
        />
      </main>
    </TransitionProvider>
  );
};

export default Layout;
