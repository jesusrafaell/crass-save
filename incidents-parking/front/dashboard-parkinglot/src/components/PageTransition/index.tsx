"use client";

import { useIsFirstRender } from "@/hooks/useIsFirstRender";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePageTransitionContext } from "@/context/PageTransitionContext";
import { getLeaveTransition } from "./transitions";
gsap.registerPlugin(useGSAP);

interface Props {
  children: React.ReactNode;
}

export function saveScrollPosition(
  url: string,
  setRoutingPageOffset: (val: number) => void
): void {
  const scrollPos = { x: window.scrollX, y: window.scrollY };
  setRoutingPageOffset(scrollPos.y);
  sessionStorage.setItem(`transition-url-${url}`, JSON.stringify(scrollPos));
}

function clearAllScrollPos(): void {
  const regex = /^transition-url/;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && regex.test(key)) {
      sessionStorage.removeItem(key);
    }
  }
}

function restoreScrollPos(url: string): void {
  const scrollPos = JSON.parse(
    sessionStorage.getItem(`transition-url-${url}`) ||
      JSON.stringify({ x: 0, y: 0 })
  );
  if (scrollPos) {
    window.scrollTo({
      top: scrollPos.y,
      left: scrollPos.x,
      behavior: "smooth",
    });
  }
}

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const isFirstRender = useIsFirstRender();
  const { routingPageOffset, setRoutingPageOffset } =
    usePageTransitionContext();

  const currentRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLCollection | null>(null);

  const [currentPath, setCurrentPath] = useState<string>(pathname);
  const [shouldScrollRestore, setShouldScrollRestore] =
    useState<boolean>(false);

  const onComplete = () => {
    window.scrollTo(0, 0);
    setCurrentPath(pathname);
    setRoutingPageOffset(0);

    if (shouldScrollRestore) {
      setTimeout(() => {
        restoreScrollPos(pathname);
        setShouldScrollRestore(false);
      }, 500);
    }
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      restoreScrollPos(pathname);

      const onReload = (): void => {
        clearAllScrollPos();
      };

      window.addEventListener("beforeunload", onReload);

      window.addEventListener("popstate", () => {
        const scrollPos = { x: window.scrollX, y: window.scrollY };
        setRoutingPageOffset(scrollPos.y);
        setShouldScrollRestore(true);
      });

      return () => {
        window.removeEventListener("beforeunload", onReload);
      };
    }
    //eslint-disable-next-line
  }, [pathname]);

  useLayoutEffect(() => {
    if (!currentRef.current) return;
    if (!lastRef.current) lastRef.current = currentRef.current.children;
    if (currentRef.current && tempRef.current) {
      const tempFirstChild = tempRef.current.children[0];
      const lastFirstChild = lastRef.current[0];
      if (tempFirstChild && lastFirstChild) {
        tempFirstChild.appendChild(lastFirstChild.cloneNode(true));
      }
      lastRef.current = currentRef.current.children;
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (currentRef.current && tempRef.current && !isFirstRender)
      getLeaveTransition({
        keys: {
          newPath: pathname,
          oldPath: currentPath,
        },
        nodes: {
          to: currentRef.current,
          from: tempRef.current,
        },
        onComplete,
      });

    //eslint-disable-next-line
  }, [isFirstRender, pathname]);

  return (
    <div className="relative">
      {pathname !== currentPath && (
        <div key={pathname + " temp"} ref={tempRef} className="relative z-10">
          <div
            className="origin-center will-change-transform"
            style={{
              transform: `translateY(-${routingPageOffset}px)`,
            }}
          />
        </div>
      )}

      <div key={pathname} ref={currentRef}>
        {children}
      </div>
    </div>
  );
}
