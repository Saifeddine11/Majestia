"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useEscapeKey, useMediaQuery, useOutsidePress } from "@/lib/a11y/hooks";
import { cn } from "@/lib/cn";
import { media } from "@/lib/design/tokens";
import { glassEntrance } from "@/lib/motion/presets";
import { Sheet } from "./Sheet";

interface ResponsivePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** The control that opened the panel. Focus returns to it on close. */
  trigger: RefObject<HTMLElement | null>;
  /** Desktop: open above or below the positioned ancestor. */
  placement?: "top" | "bottom";
  /** Desktop: horizontal alignment classes or inline position. */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Mobile sheet footer. Holds the single confirming action. */
  footer?: ReactNode;
  /** Glass token class of the surface, popover and sheet alike. Defaults to the paper sheet. */
  surfaceClassName?: string;
}

/**
 * A picker surface that adapts to the device: an anchored popover from
 * tablet width up, a bottom sheet on phones. The mobile layout is its own
 * design, not a squeezed popover.
 *
 * The desktop popover is non-modal: Escape or a press outside closes it and
 * returns focus to the trigger.
 */
export function ResponsivePanel({
  open,
  onClose,
  title,
  trigger,
  placement = "bottom",
  className,
  style,
  children,
  footer,
  surfaceClassName,
}: ResponsivePanelProps) {
  const wide = useMediaQuery(media.tablet);

  if (!wide) {
    return (
      <Sheet
        open={open}
        onClose={onClose}
        title={title}
        side="bottom"
        footer={footer}
        className={surfaceClassName}
      >
        {children}
      </Sheet>
    );
  }

  return (
    <AnimatePresence>
      {open ? (
        <Popover
          key="popover"
          onClose={onClose}
          title={title}
          trigger={trigger}
          placement={placement}
          className={className}
          style={style}
          surfaceClassName={surfaceClassName}
        >
          {children}
        </Popover>
      ) : null}
    </AnimatePresence>
  );
}

function Popover({
  onClose,
  title,
  trigger,
  placement,
  className,
  style,
  children,
  surfaceClassName,
}: Omit<ResponsivePanelProps, "open" | "footer">) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = () => {
    onClose();
    trigger.current?.focus({ preventScroll: true });
  };

  useEscapeKey(true, close);
  useOutsidePress([panel, trigger], true, onClose);

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    const target =
      node.querySelector<HTMLElement>("[data-autofocus]") ??
      node.querySelector<HTMLElement>("button:not([disabled]), [tabindex='0']") ??
      node;
    target.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className={cn(
        "absolute z-40",
        placement === "top" ? "bottom-full mb-3" : "top-full mt-3",
        className,
      )}
      style={style}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        variants={glassEntrance}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "on-light glass glass-sheet glass-enter rounded-panel p-4 outline-none",
          surfaceClassName,
        )}
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        {children}
      </motion.div>
    </div>
  );
}
