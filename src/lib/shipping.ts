export const FREE_SHIPPING_THRESHOLD = 5000;
export const POKHARA_SHIPPING_COST = 200;
export const OTHER_DISTRICT_SHIPPING_COST = 250;

const POKHARA_DISTRICT_ALIASES = new Set(['pokhara', 'kaski']);

function normalizeShippingArea(value?: string | null): string {
  if (!value) {
    return '';
  }

  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isPokharaValleyArea(value?: string | null): boolean {
  return POKHARA_DISTRICT_ALIASES.has(normalizeShippingArea(value));
}

export function calculateShippingCost(subtotal: number, district?: string | null): number | null {
  if (!district) {
    return null;
  }

  if (isPokharaValleyArea(district)) {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : POKHARA_SHIPPING_COST;
  }

  return OTHER_DISTRICT_SHIPPING_COST;
}