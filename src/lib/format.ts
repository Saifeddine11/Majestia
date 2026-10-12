const NARROW_NBSP = " ";
const NBSP = " ";

/**
 * "1 250 €". Written by hand rather than with `Intl.NumberFormat`, so the
 * server and the browser always produce the same characters.
 */
export function formatEuro(amount: number): string {
  const grouped = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NBSP);
  return `${grouped}${NBSP}€`;
}

export function plural(
  count: number,
  singular: string,
  pluralForm: string = `${singular}s`,
): string {
  return `${count}${NBSP}${count > 1 ? pluralForm : singular}`;
}
