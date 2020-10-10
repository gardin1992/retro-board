import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { Alert } from '@material-ui/lab';
import { colors } from '@material-ui/core';

interface OptionItemProps {
  children: JSX.Element;
  help: string;
  label: string;
  wide?: boolean;
}

const OptionItem = ({
  label,
  help,
  children,
  wide = false,
}: OptionItemProps) => {
  return (
    <Container>
      <HeaderContainer wide={wide}>
        <Label>
          <Typography component="div" style={{ fontWeight: 300 }}>
            {label}
          </Typography>
        </Label>
        <ComponentContainer>{children}</ComponentContainer>
      </HeaderContainer>
      <Alert>{help}</Alert>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid ${colors.grey[200]};
  background-color: ${colors.grey[50]};
  padding: 5px 15px;
  margin: 15px 0;
  border-radius: 10px;
`;

const ComponentContainer = styled.div`
  flex: 1;
`;

const Label = styled.div`
  width: 220px;
  font-weight: lighter;
`;

const HeaderContainer = styled.div<{ wide: boolean }>`
  display: flex;
  align-items: center;
  min-height: 50px;
  @media screen and (max-width: 600px) {
    ${(props) =>
      props.wide
        ? `
    flex-direction: column;
    align-items: flex-start;
    `
        : ''}
    margin-bottom: 10px;
    ${ComponentContainer} {
      width: 100%;
    }
    ${Label} {
    }
  }
`;

export default OptionItem;
