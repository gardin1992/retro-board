/**
 * Use the CSS tab above to style your Element's container.
 */
import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from './api';
import { useCallback } from 'react';
import styled from 'styled-components';
import ProductDisplay from './Product';
import { Order } from './types';
import useProducts from './useProducts';
import Step from './components/Step';
import { Button } from '@material-ui/core';
import { Currency } from 'retro-board-common';
import CurrencyPicker from './components/CurrencyPicker';

function CardSection() {
  const [order, setOrder] = useState<Order | null>(null);
  const [currency, setCurrency] = useState<Currency>('eur');
  const stripe = useStripe();
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
      <Step
        index={1}
        title="Currency"
        description="Pick a currency you would like to be billed with"
      >
        <CurrencyPicker value={currency} onChange={setCurrency} />
      </Step>
      <Step
        index={2}
        title="Plan"
        description="Choose the plan that fits your use case!"
      >
        <Products>
          {products.map((product) => (
            <ProductDisplay
              key={product.plan}
              product={product}
              currency={currency}
              onOrder={setOrder}
              selected={(order && order.plan === product.plan) || false}
            />
          ))}
        </Products>
      </Step>
      <Step
        index={3}
        title="Checkout"
        description="You will be redirected to our partner, Stripe, for payment"
      >
        <Button
          onClick={handleCheckout}
          variant="contained"
          color="primary"
          disabled={!order}
        >
          Checkout
        </Button>
      </Step>
    </Container>
  );
}

const Container = styled.div``;

const Products = styled.div`
  display: flex;
  justify-content: center;
  > * {
    margin: 20px;
  }
`;

export default CardSection;
