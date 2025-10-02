import gsap from "gsap";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const init = (node) => {
  return new Promise((resolve) =>
    gsap.set(node, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      zIndex: 0,
      onComplete: resolve,
    })
  );
};

const loginToDashboard = async ({ from, to }, onComplete) => {
  await init(to);
  const card = from.querySelector("#login-card");
  const cardContent = card.children;

  const welcomeBanner = to.querySelector("#welcome-banner");
  const textBanner = welcomeBanner.querySelectorAll("span");
  const rect = welcomeBanner.getBoundingClientRect();

  const dashboardSection = to.querySelector("#dashboard-items");
  const items = dashboardSection.children;

  const tl = gsap.timeline();
  tl.set([...textBanner], { yPercent: 100, opacity: 0 })
    .set([...items], { scale: 0.7, opacity: 0 })
    .to([...cardContent], {
      duration: 0.5,
      scale: 0.7,
      opacity: 0,
      stagger: -0.05,
      ease: "back.inOut(2.5)",
    })
    .set(card, { position: "absolute" })

    .to(card, {
      duration: 1,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      maxWidth: "none",
      height: rect.height,
      borderRadius: "0.375rem",
      ease: "power4.out",

      onComplete,
    })
    .to(
      [...textBanner],
      {
        duration: 0.35,
        yPercent: 0,
        opacity: 1,
        stagger: 0.05,
      },
      "end"
    )
    .to(
      [...items],
      {
        duration: 0.5,
        scale: 1,
        opacity: 1,
        stagger: {
          each: 0.07,
          from: "random",
          ease: "power2.in",
        },
        ease: "back.out(2)",
      },
      "end"
    );
};

export const getLeaveTransition = ({ keys, nodes, onComplete }) => {
  if (
    (keys.newPath.includes("/company") || keys.newPath.includes("/parking")) &&
    keys.oldPath.includes("/login")
  ) {
    loginToDashboard(nodes, onComplete);
    return;
  }

  onComplete();
};
