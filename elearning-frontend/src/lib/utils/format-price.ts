const formatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'VND',
});

/**
 * Format price to currency
 * @example
 * formatPrice(1000000) // 1,000,000 VND
 * formatPrice(10000000) // 10,000,000 VND
 * formatPrice(100000000) // 100,000,000 VND
 */
export const formatPrice = (price: number) => formatter.format(price);
