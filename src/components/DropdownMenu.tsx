"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  button: React.ReactNode;
  children: React.ReactNode;
}

export const DropdownMenu = ({ button, children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{button}</div>
      {open && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50
                        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-lg shadow-lg p-2 space-y-1 w-36 text-sm transition-all"
        >
          {children}
        </div>
      )}
    </div>
  );
};
