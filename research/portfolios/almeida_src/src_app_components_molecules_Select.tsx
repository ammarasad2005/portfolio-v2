"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { createPortal } from "react-dom";
import usePortal from "@/hooks/usePortal";
import { mergeClassNames } from "@/utils/classNames";

type Option = {
  label: string;
  value: string;
};

type SelectorProps = {
  label: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function Selector({ label, options, onChange }: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(options[0]);
  const portalRoot = usePortal(`select-${label}`);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isFirstOptionSelected = selected.value === options[0].value;

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs group">
      {label && (
        <label className="capitalize block mb-2 text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={mergeClassNames(
          "w-full px-4 py-2",
          "flex justify-between items-center",
          "bg-transparent text-sm ",
          "rounded-md shadow-sm border-2",
          "transition-colors duration-300",
          isOpen
            ? "border-[var(--action)]"
            : "border-[var(--color-foreground)]/25 hover:border-[var(--action)]"
        )}
      >
        <span
          className={mergeClassNames(
            "group-hover:text-gray-200",
            "transition-colors duration-300",
            isFirstOptionSelected
              ? "text-[var(--color-foreground)]/25"
              : "text-gray-200"
          )}
        >
          {selected.label}
        </span>
        <FiChevronDown
          size={24}
          className={`transition-all duration-300 text-[var(--color-foreground)]/25 group-hover:text-[var(--action)] ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen &&
        portalRoot &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-40 rounded-md bg-[var(--color-background)]/60 backdrop-blur-3xl shadow-md overflow-y-auto max-h-[200px] custom-scrollbar"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              opacity: coords.top === 0 ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
              pointerEvents: coords.top === 0 ? "none" : "auto",
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="cursor-pointer m-2 p-2 hover:bg-[var(--color-background)]/60 rounded text-gray-200 transition-colors"
              >
                {option.label}
              </div>
            ))}
          </div>,
          portalRoot
        )}
    </div>
  );
}
