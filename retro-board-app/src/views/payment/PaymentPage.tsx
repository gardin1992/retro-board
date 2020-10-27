/**
 * Use the CSS tab above to style your Element's container.
 */
import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

import { useContext } from 'react';
import UserContext from '../../auth/Context';
import { createCheckoutSession } from './api';
import { useCallback } from 'react';
import useUser from '../../auth/useUser';
import styled from 'styled-components';
import ProductDisplay from './Product';
import { Order } from './types';
import useProducts from './useProducts';

function CardSection() {
  const { setUser } = useContext(UserContext);
  const [order, setOrder] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);
  const stripe = useStripe();
  const user = useUser();
  const products = useProducts();

  const handleCheckout = useCallback(async () => {
    // Call your backend to create the Checkout Session
    if (order) {
      console.log('Order: ', order);
      const session = await createCheckoutSession(order.plan, order.currency);

      if (session && stripe) {
        await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      }
    }

    // When the customer clicks on the button, redirect them to Checkout.
  }, [stripe, order]);
  return (
    <Container>
      <Products>
        {products.map((product) => (
          <ProductDisplay
            key={product.plan}
            product={product}
            currency="eur"
            onOrder={setOrder}
            selected={(order && order.plan === product.plan) || false}
          />
        ))}
        {/* <ProductDisplay
          product={}
          onOrder={setOrder}
          selected={
            (order &&
              order.stripePriceId === 'price_1HgDnuCpRjtjIslJCUMeS8pF') ||
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
        /> */}
      </Products>

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
