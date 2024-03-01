"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const escapeHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.shiftKey) router.back();
    },
    [router]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escapeHandler);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [escapeHandler]);

  const outermostElement = useRef<HTMLDivElement>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.target === outermostElement.current) router.back();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md w-screen h-screen flex justify-center overflow-auto z-10 p-4"
      ref={outermostElement}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
