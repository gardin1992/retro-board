import React from 'react';
import { Product, Currency } from 'retro-board-common';
import 'flag-icon-css/css/flag-icon.min.css';
import styled from 'styled-components';
import ProductDisplay from './Product';
import useProducts from './useProducts';

interface ProductPickerProps {
  value: Product | null;
  currency: Currency;
  onChange: (value: Product) => void;
}

function ProductPicker({ value, currency, onChange }: ProductPickerProps) {
  const products = useProducts();
  return (
    <Container>
      {products.map((product) => (
        <ProductDisplay
          key={product.plan}
          product={product}
          currency={currency}
          onSelect={onChange}
          selected={value === product}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  > * {
    margin: 20px;
  }
`;

export default ProductPicker;
