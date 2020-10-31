import React from 'react';
import { Order } from './types';
import styled from 'styled-components';
import { colors } from '@material-ui/core';
import { useCallback } from 'react';
import { Product, Currency } from 'retro-board-common';

interface ProductDisplayProps {
  product: Product;
  currency: Currency;
  selected: boolean;
  onOrder: (order: Order) => void;
}

function ProductDisplay({
  product,
  selected,
  currency,
  onOrder,
}: ProductDisplayProps) {
  const handleOrder = useCallback(() => {
    const order: Order = {
      currency,
      plan: product.plan,
    };
    onOrder(order);
  }, [onOrder, currency, product]);

  return (
    <Container onClick={handleOrder} selected={selected}>
      <Header>{product.name}</Header>
      <Description>tbd</Description>
      <Quantity>tbd</Quantity>
      <Total>
        {product[currency] / 100} {currency.toUpperCase()}
      </Total>
    </Container>
  );
}

const Container = styled.div<{ selected: boolean }>`
  border: 1px solid ${colors.deepPurple[500]};
  margin: 20px;
  ${(props) =>
    props.selected
      ? `
    border: 3px solid ${colors.deepPurple[500]};
    margin: 18px;
  `
      : null};
  border-radius: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${colors.deepPurple[500]};
`;

const Description = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${colors.deepPurple[500]};
  background-color: ${colors.deepPurple.A100};
  flex: 1;
`;

const Quantity = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
`;

const Total = styled.div`
  background-color: ${colors.deepPurple[500]};
  border-radius: 0 0 10px 10px;
  color: white;
  text-align: center;
  font-size: 2em;
  font-weight: 100;
`;

export default ProductDisplay;
