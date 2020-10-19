import { FullUser, CreateSubscriptionPayload } from 'retro-board-common';
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
    await createSubscription(customerId, result.paymentMethod.id, priceId);
    return {
      success: true,
    };
  }

  return {
    success: false,
    error: 'unknown error',
  };
}

async function createSubscription(
  customerId: string,
  paymentMethodId: string,
  priceId: string
) {
  const body: CreateSubscriptionPayload = {
    customerId,
    paymentMethodId,
    priceId,
    quantity: 10,
  };
  const response = await fetch('/api/stripe/create-subscription', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    const result = await response.json();
    console.log('Result: ', result);
  }
  //     .then((response) => {
  //       return response.json();
  //     })
  //     // If the card is declined, display an error to the user.
  //     .then((result) => {
  //       if (result.error) {
  //         // The card had an error when trying to attach it to a customer.
  //         throw result;
  //       }
  //       return result;
  //     })
  //     // Normalize the result to contain the object returned by Stripe.
  //     // Add the additional details we need.
  //     .then((result) => {
  //       return {
  //         paymentMethodId: paymentMethodId,
  //         priceId: priceId,
  //         subscription: result,
  //       };
  //     })
  //     // Some payment methods require a customer to be on session
  //     // to complete the payment process. Check the status of the
  //     // payment intent to handle these actions.
  //     .then(() => {}) // handlePaymentThatRequiresCustomerAction)
  //     // If attaching this card to a Customer object succeeds,
  //     // but attempts to charge the customer fail, you
  //     // get a requires_payment_method error.
  //     .then(() => {}) // handleRequiresPaymentMethod)
  //     // No more actions required. Provision your service for the user.
  //     .then(() => {}) // onSubscriptionComplete)
  //     .catch((error) => {
  //       // An error has happened. Display the failure to the user here.
  //       // We utilize the HTML element we created.
  //       showCardError(error);
  //     })
  // );
}
