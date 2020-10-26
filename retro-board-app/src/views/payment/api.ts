import { FullUser, CreateSubscriptionPayload } from 'retro-board-common';
import { Stripe, StripeCardElement, StripeError } from '@stripe/stripe-js';
import { Order } from './types';

const requestConfig: Partial<RequestInit> = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
  referrer: 'no-referrer',
};

export async function createCheckoutSession(
  priceId: string,
  quantity: number
): Promise<{ id: string } | null> {
  const response = await fetch(`/api/stripe/create-checkout-session`, {
    method: 'POST',
    ...requestConfig,
    body: JSON.stringify({
      price: priceId,
      quantity,
    }),
  });
  if (response.ok) {
    const user: { id: string } = await response.json();
    return user;
  }
  return null;
}
