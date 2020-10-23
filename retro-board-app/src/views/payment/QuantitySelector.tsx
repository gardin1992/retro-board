import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

interface QuantitySelectorProps {
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function QuantitySelector({
  value,
  step,
  min,
  max,
  onChange,
}: QuantitySelectorProps) {
  const handlePlus = useCallback(() => {
    const newValue = value + step;
    if (newValue > max) {
      return;
    }
    onChange(newValue);
  }, [value, step, max, onChange]);
  const handleMinus = useCallback(() => {
    const newValue = value - step;
    if (newValue < min) {
      return;
    }
    onChange(newValue);
  }, [value, step, min, onChange]);
  const canPlus = value + step <= max;
  const canMinus = value - step >= min;
  return (
    <Container>
      <Value>{value}</Value>
      <Buttons>
        <Button disabled={!canPlus} onClick={handlePlus}>
          +
        </Button>
        <Button disabled={!canMinus} onClick={handleMinus}>
          -
        </Button>
      </Buttons>
    </Container>
  );
}

const Container = styled.div``;

const Value = styled.div``;

const Buttons = styled.div``;

export default QuantitySelector;
