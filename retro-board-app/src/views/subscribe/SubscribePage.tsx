/**
 * Use the CSS tab above to style your Element's container.
 */
import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from './api';
import { useCallback } from 'react';
import styled from 'styled-components';
import Step from './components/Step';
import { Button } from '@material-ui/core';
import { Currency, Product } from 'retro-board-common';
import CurrencyPicker from './components/CurrencyPicker';
import ProductPicker from './components/ProductPicker';

function CardSection() {
  const [currency, setCurrency] = useState<Currency>('eur');
  const [product, setProduct] = useState<Product | null>(null);
  const stripe = useStripe();

  const handleCheckout = useCallback(async () => {
    if (product) {
      const session = await createCheckoutSession(product.plan, currency);

      if (session && stripe) {
        await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      }
    }
  }, [stripe, product, currency]);
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
        <ProductPicker
          value={product}
          currency={currency}
          onChange={setProduct}
        />
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
          disabled={!product}
        >
          Checkout
        </Button>
      </Step>
    </Container>
  );
}

const Container = styled.div``;

export default CardSection;
