// src/config/offers.ts
//
// Manual, lightweight pricing-ladder tracker for the Website Build and
// Consulting Call offers. No automation/webhooks yet — bump `salesCount` /
// `callsCount` by hand as sales/calls come in, and bump `price` to the next
// rung in `ladder` every time the count crosses a multiple of 20.
//
// Both /shop and /website read `price` from here so the number stays in
// sync in one place.

export const offers = {
  website: {
    price: 500,
    salesCount: 0,
    ladder: [500, 550, 600, 650],
    checkoutUrl: 'https://buy.stripe.com/8x2fZg3Gv6vE9xwc1i2oE0f',
  },
  consulting: {
    price: 150,
    callsCount: 0,
    ladder: [150, 200, 250, 300],
    // TODO: replace with the real $150 Stripe Payment Link once created.
    checkoutUrl: 'REPLACE_WITH_150_CONSULTING_LINK',
  },
} as const;

export type OfferKey = keyof typeof offers;

export function getOfferPrice(key: OfferKey): number {
  return offers[key].price;
}
