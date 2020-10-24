import React, { useState } from 'react';
import { Order } from './types';
import styled from 'styled-components';
import { colors } from '@material-ui/core';
import QuantitySelector from './QuantitySelector';
import { useCallback } from 'react';

interface ProductDisplayProps {
  stripePriceId: string;
  label: string;
  description: string;
  pricePer10?: number;
  price: number;
  selected: boolean;
  onOrder: (order: Order) => void;
}

function ProductDisplay({
  stripePriceId,
  label,
  description,
  pricePer10,
  price,
  selected,
  onOrder,
}: ProductDisplayProps) {
  const [quantity, setQuantity] = useState(10);
  const total = price + (quantity / 10) * (pricePer10 || 0);
  const handleOrder = useCallback(() => {
    const order: Order = {
      price: total,
      quantity: pricePer10 ? quantity : null,
      stripePriceId,
    };
    onOrder(order);
  }, [total, quantity, stripePriceId, onOrder, pricePer10]);
  const handleQuantity = useCallback(
    (qty: number) => {
      setQuantity(qty);
      handleOrder();
    },
    [handleOrder]
  );
  return (
    <Container onClick={handleOrder} selected={selected}>
      <Header>{label}</Header>
      <Description>{description}</Description>
      <Quantity>
        {pricePer10 ? (
          <QuantitySelector
            min={10}
            max={50}
            value={quantity}
            onChange={handleQuantity}
            step={10}
          />
        ) : (
          <Unlimited>Unlimited</Unlimited>
        )}
      </Quantity>
      <Total>{total.toFixed(2)} GBP</Total>
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

const Unlimited = styled.div`
  text-align: center;
  font-weight: 100;
  font-size: 2em;
  width: 100%;
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
