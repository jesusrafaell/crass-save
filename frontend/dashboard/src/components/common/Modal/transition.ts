export const transitionTypes = {
  overlay: () => ({
    onEnter: {
      duration: 0.35,
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    onExit: {
      duration: 0.35,
      backdropFilter: "blur(0px)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  }),
  botToTop: (isDesktop: boolean) => ({
    onEnter: {
      duration: 0.6,
      transform: isDesktop ? "translate(-50%, 50%)" : "translate(0, 0)",
      ease: "power3.out",
    },
    onExit: {
      duration: 0.4,
      y: isDesktop ? "180%" : "100%",
      opacity: 0,
      ease: "power3.out",
    },
  }),
  scale: () => ({
    onEnter: {
      duration: 0.3,
      scale: 1,
      opacity: 1,
      ease: "power3.out",
    },
    onExit: {
      duration: 0.3,
      scale: 0.7,
      opacity: 0,
      ease: "power3.out",
    },
  }),
  small: () => ({
    onEnter: {
      duration: 0.6,
      transform: "translate(-50%, 50%)",
      ease: "power3.out",
    },
    onExit: {
      duration: 0.4,
      y: "180%",
      opacity: 0,
      ease: "power3.out",
    },
  }),
};
