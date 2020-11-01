import React, { useState, useMemo } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from './api';
import { useCallback } from 'react';
import styled from 'styled-components';
import Step from './components/Step';
import { Button } from '@material-ui/core';
import { Currency, Product, FullUser } from 'retro-board-common';
import CurrencyPicker from './components/CurrencyPicker';
import ProductPicker from './components/ProductPicker';
import Input from '../../components/Input';
import useUser from '../../auth/useUser';

function guessDomain(user: FullUser | null): string {
  if (user && user.email) {
    const parts = user.email.split('@');
    if (parts.length === 2) {
      return parts[1];
    }
  }
  return 'acme.com';
}

function SubscriberPage() {
  const user = useUser();
  const [currency, setCurrency] = useState<Currency>('eur');
  const [product, setProduct] = useState<Product | null>(null);
  const [domain, setDomain] = useState<string>(guessDomain(user));
  const stripe = useStripe();
  const needDomain = product && product.seats === null;

  const validDomain = useMemo(() => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3})$/g;
    return domainRegex.test(domain);
  }, [domain]);

  const validForm = (!needDomain || validDomain) && !!product;

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
      {needDomain ? (
        <Step
          index={3}
          title="Domain"
          description="Your unlimited subscription applies to a given domain."
        >
          <Input
            value={domain}
            onChangeValue={setDomain}
            error={!validDomain}
            helperText={!validDomain ? 'Please provide a valid domain' : null}
            required
          />
        </Step>
      ) : null}
      <Step
        index={needDomain ? 4 : 3}
        title="Checkout"
        description="You will be redirected to our partner, Stripe, for payment"
      >
        <Button
          onClick={handleCheckout}
          variant="contained"
          color="primary"
          disabled={!validForm}
        >
          Checkout
        </Button>
      </Step>
    </Container>
  );
}

const Container = styled.div``;

export default SubscriberPage;
