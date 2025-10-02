import React, { ReactNode, createContext, useContext, useState } from "react";
import gsap from "gsap";

type TransitionProviderProps = {
  children: ReactNode;
};

interface TransitionContextType {
  timeline: gsap.core.Timeline;
  isTransitionActive: boolean;
  routingPageOffset: number;
  setTimeline: (value: gsap.core.Timeline) => void;
  setIsTransitionActive: (val: boolean) => void;
  setRoutingPageOffset: (val: number) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  timeline: gsap.timeline({ paused: true }) as gsap.core.Timeline,
  isTransitionActive: false,
  routingPageOffset: 0,
  setIsTransitionActive: (_) => {},
  setRoutingPageOffset: (_) => {},
  setTimeline: () => {},
});

const TransitionProvider: React.FC<TransitionProviderProps> = ({
  children,
}) => {
  const [timeline, setTimeline] = useState<gsap.core.Timeline>(() =>
    gsap.timeline({ paused: true })
  );
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [routingPageOffset, setRoutingPageOffset] = useState(0);

  return (
    <TransitionContext.Provider
      value={{
        timeline,
        isTransitionActive,
        routingPageOffset,
        setTimeline,
        setIsTransitionActive,
        setRoutingPageOffset,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

const usePageTransitionContext = () => useContext(TransitionContext);

export { usePageTransitionContext, TransitionProvider };
