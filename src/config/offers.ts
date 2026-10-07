// src/config/offers.ts
//
// Manual, lightweight pricing-ladder tracker for the Consulting Call offer.
// No automation/webhooks yet — bump `callsCount` by hand as calls come in,
// and bump `price` to the next rung in `ladder` every time the count
// crosses a multiple of 20.
//
// /shop reads `price` from here so the number stays in sync in one place.

export const offers = {
  consulting: {
    price: 150,
    callsCount: 0,
    ladder: [150, 200, 250, 300],
    checkoutUrl: 'https://buy.stripe.com/fZu28q3Gvf2a6lkaXe2oE0n',
  },
} as const;

export type OfferKey = keyof typeof offers;

export function getOfferPrice(key: OfferKey): number {
  return offers[key].price;
}
