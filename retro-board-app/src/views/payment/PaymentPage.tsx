/**
 * Use the CSS tab above to style your Element's container.
 */
import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../../auth/Context';
import { createStripeCustomer, createPaymentMethod } from './api';
import { Button } from '@material-ui/core';
import { useCallback } from 'react';
import useUser from '../../auth/useUser';

const CARD_ELEMENT_OPTIONS = {
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
  const elements = useElements();
  const stripe = useStripe();
  const user = useUser();
  const handlePay = useCallback(async () => {
    const cardElement = elements?.getElement(CardElement);
    console.log(stripe, user, user?.stripeId, cardElement);
    if (stripe && user && elements && user.stripeId && cardElement) {
      await createPaymentMethod(stripe, cardElement, user.stripeId, 'xx');
    }
  }, [elements, stripe, user]);
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
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <Button onClick={handlePay}>Pay</Button>
    </label>
  );
}

export default CardSection;
