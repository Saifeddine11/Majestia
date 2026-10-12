"use client";

import { motion } from "motion/react";
import type { DateRange, SearchResult } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { listContainer, listItem } from "@/lib/motion/presets";
import { buildHref, DEFAULT_SEARCH, type SearchState } from "@/lib/search/params";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  /** A property with its price and availability; both optional outside a search. */
  items: Array<Pick<SearchResult, "property"> & Partial<Omit<SearchResult, "property">>>;
  destinationNames: Record<string, string>;
  /** Carried into each property link so dates and guests follow the visitor. */
  search?: SearchState;
  /**
   * `reveal`: server-rendered list, revealed on scroll by GSAP.
   * `enter`: list that appears after data loads, animated by Motion.
   * Each item node has exactly one of the two.
   */
  mode?: "reveal" | "enter";
  onPickDates?: (range: DateRange) => void;
  /** How many leading cards load their photograph at once. */
  eagerCount?: number;
  /** Surface of every card. See `PropertyCard`. */
  tone?: "paper" | "glass";
  className?: string;
}

const gridClass = "grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3";

export function PropertyGrid({
  items,
  destinationNames,
  search = DEFAULT_SEARCH,
  mode = "reveal",
  onPickDates,
  eagerCount = 0,
  tone,
  className,
}: PropertyGridProps) {
  const cards = items.map((item, index) => ({
    key: item.property.slug,
    node: (
      <PropertyCard
        property={item.property}
        destinationName={destinationNames[item.property.destination] ?? item.property.destination}
        href={buildHref(`/properties/${item.property.slug}`, { ...search, destination: null })}
        price={item.price}
        availability={item.availability}
        onPickDates={onPickDates}
        eager={index < eagerCount}
        tone={tone}
      />
    ),
  }));

  if (mode === "enter") {
    return (
      <motion.ul
        className={cn(gridClass, className)}
        variants={listContainer}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => (
          <motion.li key={card.key} variants={listItem}>
            {card.node}
          </motion.li>
        ))}
      </motion.ul>
    );
  }

  return (
    <ul className={cn(gridClass, className)}>
      {cards.map((card) => (
        <li key={card.key} data-reveal>
          {card.node}
        </li>
      ))}
    </ul>
  );
}
