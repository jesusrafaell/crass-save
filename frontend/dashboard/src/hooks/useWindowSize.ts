import { useState, useEffect } from "react";

type WindowSizeType = {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const useWindowSize = (): WindowSizeType => {
  const [windowSize, setWindowSize] = useState<WindowSizeType>({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let isMobile = width <= 768;
      let isTablet = width > 768 && width <= 1024;
      let isDesktop = width > 1024;

      setWindowSize({ width, height, isMobile, isTablet, isDesktop });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
