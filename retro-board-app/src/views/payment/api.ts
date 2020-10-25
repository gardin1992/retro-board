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

interface OperationResult {
  success: boolean;
  error?: string;
}

export async function createPaymentMethod(
  stripe: Stripe,
  cardElement: StripeCardElement,
  customerId: string,
  order: Order
): Promise<OperationResult> {
  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  console.log('Got a payment method: ', result);

  // await stripe.confirmCardPayment('', result, {})

  if (result.error) {
    return {
      success: false,
      error: result.error.message,
    };
  } else if (result.paymentMethod) {
    await createSub2(
      stripe,
      customerId,
      result.paymentMethod.id,
      order.stripePriceId,
      order.quantity || 1
    );
    return {
      success: true,
    };
  }

  return {
    success: false,
    error: 'unknown error',
  };
}

function createSub2(
  stripe: Stripe,
  customerId: string,
  paymentMethodId: string,
  priceId: string,
  quantity: number
) {
  const body: CreateSubscriptionPayload = {
    customerId,
    paymentMethodId,
    priceId,
    quantity,
  };
  fetch('/api/stripe/create-subscription', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log('got normal response');
      return response.json();
    })
    // If the card is declined, display an error to the user.
    .then((result) => {
      console.log('result', result);
      if (result.error) {
        console.log('result error');
        // The card had an error when trying to attach it to a customer.
        throw result;
      }
      return result;
    })
    // Normalize the result to contain the object returned by Stripe.
    // Add the additional details we need.
    .then((result) => {
      return {
        paymentMethodId: paymentMethodId,
        priceId: priceId,
        subscription: result,
      };
    })
    // Some payment methods require a customer to be on session
    // to complete the payment process. Check the status of the
    // payment intent to handle these actions.
    .then((handlePaymentThatRequiresCustomerAction as unknown) as any)
    // If attaching this card to a Customer object succeeds,
    // but attempts to charge the customer fail, you
    // get a requires_payment_method error.
    // .then(handleRequiresPaymentMethod)
    // No more actions required. Provision your service for the user.
    // .then(onSubscriptionComplete)
    .catch((error: any) => {
      // An error has happened. Display the failure to the user here.
      // We utilize the HTML element we created.
      console.error('ERROR: ', error);
      // showCardError(error);
    });

  function handlePaymentThatRequiresCustomerAction({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }: any) {
    console.log('goes to handle');
    if (subscription && subscription.status === 'active') {
      // Subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    }

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    let paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            // Start code flow to handle updating the payment details.
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc).
            throw result;
          } else {
            if (result.paymentIntent!.status === 'succeeded') {
              // Show a success message to your customer.
              // There's a risk of the customer closing the window before the callback.
              // We recommend setting up webhook endpoints later in this guide.
              return {
                priceId: priceId,
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
              };
            }
          }
        })
        .catch((error) => {
          // displayError(error);
          console.error('ERROR2: ', error);
        });
    } else {
      // No customer action needed.
      return { subscription, priceId, paymentMethodId };
    }
  }
}

async function createSubscription(
  customerId: string,
  paymentMethodId: string,
  priceId: string,
  quantity: number
) {
  const body: CreateSubscriptionPayload = {
    customerId,
    paymentMethodId,
    priceId,
    quantity,
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
