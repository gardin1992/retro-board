import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';

interface SettingCategoryProps {
  title: string;
  subtitle: string;
}

const SettingCategory: React.FC<SettingCategoryProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Container>
      <Typography
        variant="h6"
        gutterBottom
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        {title}
      </Typography>
      <Alert severity="success">{subtitle}</Alert>
      <ChildrenContainer>{children}</ChildrenContainer>
    </Container>
  );
};

const ChildrenContainer = styled.div`
  width: 100%;
`;

const Container = styled.div``;

export default SettingCategory;
