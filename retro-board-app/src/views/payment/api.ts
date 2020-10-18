import { FullUser } from 'retro-board-common';
import { Stripe, StripeCardElement, StripeError } from '@stripe/stripe-js';

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

export async function createStripeCustomer(): Promise<FullUser | null> {
  const response = await fetch(`/api/stripe/create-customer`, {
    method: 'POST',
    ...requestConfig,
  });
  if (response.ok) {
    const user: FullUser = await response.json();
    return user;
  }
  return null;
}

interface OperationResult {
  success: boolean;
  error?: string;
}

export async function createPaymentMethod(
  stripe: Stripe,
  cardElement: StripeCardElement,
  customerId: string,
  priceId: string
): Promise<OperationResult> {
  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  console.log('Got a payment method: ', result);

  if (result.error) {
    return {
      success: false,
      error: result.error.message,
    };
  } else if (result.paymentMethod) {
    await createSubscription({
      customerId: customerId,
      paymentMethodId: result.paymentMethod.id,
      priceId: priceId,
    });
    return {
      success: true,
    };
  }

  return {
    success: false,
    error: 'unknown error',
  };
}

async function createSubscription(stuff: any) {}
