/**
 * Use the CSS tab above to style your Element's container.
 */
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import { useContext } from 'react';
import { noop } from 'lodash';
import UserContext from '../../auth/Context';
import {
  createStripeCustomer,
  createPaymentMethod,
  createCheckoutSession,
} from './api';
import { Button } from '@material-ui/core';
import { useCallback } from 'react';
import useUser from '../../auth/useUser';
import styled from 'styled-components';
import ProductDisplay from './Product';
import { Order } from './types';
import { StripeCardElementOptions } from '@stripe/stripe-js';

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

function CardSection() {
  const { setUser } = useContext(UserContext);
  const [order, setOrder] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const user = useUser();
  const handlePay = useCallback(async () => {
    const cardElement = elements?.getElement(CardElement);
    console.log(stripe, user, user?.stripeId, cardElement);
    if (stripe && user && elements && user.stripeId && cardElement && order) {
      console.log('before create payment');
      setPaying(true);
      const result = await createPaymentMethod(
        stripe,
        cardElement,
        user.stripeId,
        order
      );
      setPaying(false);
      console.log('Final result: ', result);
    }
  }, [elements, stripe, user, order]);
  useEffect(() => {
    // Link the user to Stripe
    async function link() {
      const updatedUser = await createStripeCustomer();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    link();
  }, [setUser]);
  const handleCheckout = useCallback(async () => {
    // Call your backend to create the Checkout Session
    if (order) {
      console.log('Order: ', order);
      const session = await createCheckoutSession(
        order.stripePriceId,
        order.quantity || 1
      );

      if (session && stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      }
    }

    // When the customer clicks on the button, redirect them to Checkout.
  }, [stripe, order]);
  return (
    <Container>
      <Products>
        <ProductDisplay
          label="Pro Team"
          description="Perfect for smaller teams"
          stripePriceId="price_1HdWOTCpRjtjIslJ2teM1TBT"
          price={0}
          pricePer10={9.99}
          onOrder={setOrder}
          selected={
            (order &&
              order.stripePriceId === 'price_1HdWOTCpRjtjIslJ2teM1TBT') ||
            false
          }
        />
        <ProductDisplay
          label="Pro Company"
          description="Unlimited licenses for the entire company"
          stripePriceId="price_1HgCxDCpRjtjIslJNGlY5xcy"
          price={49.99}
          onOrder={setOrder}
          selected={
            (order &&
              order.stripePriceId === 'price_1HgCxDCpRjtjIslJNGlY5xcy') ||
            false
          }
        />
      </Products>
      <label>
        Card details
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <Button onClick={handlePay} disabled={paying}>
          Pay
        </Button>
      </label>
      <button onClick={handleCheckout} role="link">
        Checkout
      </button>
    </Container>
  );
}

const Container = styled.div``;

const Products = styled.div`
  display: flex;
  justify-content: center;
  > * {
    margin: 50px;
  }
`;

export default CardSection;
