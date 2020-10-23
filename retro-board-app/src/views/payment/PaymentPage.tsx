/**
 * Use the CSS tab above to style your Element's container.
 */
import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import { useContext } from 'react';
import { noop } from 'lodash';
import UserContext from '../../auth/Context';
import { createStripeCustomer, createPaymentMethod } from './api';
import { Button } from '@material-ui/core';
import { useCallback } from 'react';
import useUser from '../../auth/useUser';
import styled from 'styled-components';
import ProductDisplay from './Product';

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
      const result = await createPaymentMethod(
        stripe,
        cardElement,
        user.stripeId,
        'price_1HdWOTCpRjtjIslJ2teM1TBT' // TODO Parameterize
      );
      console.log('Final result: ', result);
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
    <Container>
      <ProductDisplay
        label="Pro Team"
        description="Perfect for smaller teams"
        stripePriceId="price_1HdWOTCpRjtjIslJ2teM1TBT"
        price={0}
        pricePer10={9.99}
        onOrder={noop}
      />
      <ProductDisplay
        label="Pro Company"
        description="Unlimited licenses for the entire company"
        stripePriceId="price_1HdWOTCpRjtjIslJ2teM1TBT"
        price={49.99}
        onOrder={noop}
      />

      <label>
        Card details
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <Button onClick={handlePay}>Pay</Button>
      </label>
    </Container>
  );
}

const Container = styled.div``;

export default CardSection;
