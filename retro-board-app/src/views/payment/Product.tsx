import React, { useState } from 'react';
import { Order } from './types';
import styled from 'styled-components';
import { colors } from '@material-ui/core';
import QuantitySelector from './QuantitySelector';

interface ProductDisplayProps {
  stripePriceId: string;
  label: string;
  description: string;
  pricePer10?: number;
  price: number;
  onOrder: (order: Order) => void;
}

function ProductDisplay({
  stripePriceId,
  label,
  description,
  pricePer10,
  price,
  onOrder,
}: ProductDisplayProps) {
  const [quantity, setQuantity] = useState(10);
  const total = price + (quantity / 10) * (pricePer10 || 0);
  return (
    <Container>
      <Header>{label}</Header>
      <Description>{description}</Description>
      <Quantity>
        {pricePer10 ? (
          <QuantitySelector
            min={10}
            max={50}
            value={quantity}
            onChange={setQuantity}
            step={10}
          />
        ) : null}
      </Quantity>
      <Total>{total.toFixed(2)} GBP</Total>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid ${colors.deepPurple[500]};
  margin: 20px;
  border-radius: 10px;
  width: 300px;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${colors.deepPurple[500]};
`;

const Description = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${colors.deepPurple[500]};
  background-color: ${colors.deepPurple.A100};
`;

const Quantity = styled.div``;

const Total = styled.div`
  background-color: ${colors.deepPurple[500]};
  color: white;
  text-align: center;
  font-size: 2em;
  font-weight: 100;
`;

export default ProductDisplay;
