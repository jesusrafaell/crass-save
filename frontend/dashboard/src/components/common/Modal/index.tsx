import React, { useEffect, useMemo, useRef, ReactNode } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { Transition } from "react-transition-group";
import useWindowSize from "@/hooks/useWindowSize";
import { transitionTypes } from "./transition";
import Portal from "@/components/common/Portal";
import Box from "./Box";

interface ModalProps {
  id?: string;
  isOpen: boolean;
  bodyScroll?: boolean;
  style?: Partial<React.CSSProperties>;
  genStyles?: string;
  transitionType?: "botToTop" | "overlay" | "scale" | "small";
  children?: ReactNode;
  close: () => void;
}

const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  bodyScroll,
  children,
  style,
  genStyles,
  transitionType = "botToTop",
  close,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);

  const { width, height } = useWindowSize();

  const tl = useMemo(() => gsap.timeline(), []);

  const isDesktop = width && width >= 800;

  const transition = transitionTypes[transitionType];

  const onTransition = (done: () => void) => {
    tl.to(parentRef.current, {
      ...transitionTypes.overlay()[isOpen ? "onEnter" : "onExit"],
    }).to(
      childRef.current,
      {
        ...transition(!!isDesktop)[isOpen ? "onEnter" : "onExit"],
        onComplete: done,
      },
      "<"
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) close();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isOpen]);

  useEffect(() => {
    if (typeof bodyScroll !== "undefined" && !bodyScroll)
      document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      if (typeof bodyScroll !== "undefined" && !bodyScroll)
        document.body.style.overflow = "unset";
    };
  }, [isOpen, bodyScroll]);

  useEffect(() => {
    if (childRef.current)
      gsap.to(childRef.current, {
        ...transition(!!isDesktop)[isOpen ? "onEnter" : "onExit"],
        overwrite: true,
      });
  }, [isOpen, width, height, isDesktop, transition]);

  const childModalProps = {
    ref: childRef,
    children,
    style,
    genStyles,
    close,
  };

  return (
    <Transition
      in={isOpen}
      nodeRef={parentRef}
      addEndListener={onTransition}
      unmountOnExit
      mountOnEnter
    >
      <Portal id={id}>
        <ModalStyled ref={parentRef}>
          <div className="closer" onClick={close} />
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {React.cloneElement(<Box />, childModalProps)}
          </div>
        </ModalStyled>
      </Portal>
    </Transition>
  );
};

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 110;
  .closer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default Modal;
