import { useEffect, useRef, FC } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  id?: string;
}

const Portal: FC<PortalProps> = ({ children, id }) => {
  const containerRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const container = containerRef.current;

    if (id) container.id = id;

    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, [id]);

  return ReactDOM.createPortal(children, containerRef.current);
};

export default Portal;
