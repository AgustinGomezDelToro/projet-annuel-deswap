// src/components/home/MouseLightEffect.tsx
import React, { useEffect, useRef } from "react";
import "./MouseLightEffect.scss";

const MouseLightEffect = () => {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (lightRef.current) {
        lightRef.current.style.left = `${event.clientX}px`;
        lightRef.current.style.top = `${event.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div ref={lightRef} className="mouse-light-effect" />;
};

export default MouseLightEffect;
