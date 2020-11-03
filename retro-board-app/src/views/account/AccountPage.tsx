import React from 'react';
import usePortalUrl from './usePortalUrl';
import { Button } from '@material-ui/core';
import { Page } from '../../components/Page';
import useUser from '../../auth/useUser';
import styled from 'styled-components';
import ProPill from '../../components/ProPill';
import { Alert } from '@material-ui/lab';

function AccountPage() {
  const url = usePortalUrl();
  const user = useUser();

  if (!user) {
    return null;
  }

  if (user.accountType === 'anonymous') {
    return (
      <Alert severity="error">
        Anonymous accounts cannot have access to their profile.
      </Alert>
    );
  }

  return (
    <Page>
      <Name>
        {user.name}&nbsp;{user.pro ? <ProPill /> : null}
      </Name>

      <Data>
        <Title>Username</Title>
        <Value>{user.username}</Value>
      </Data>

      <Data>
        <Title>Email</Title>
        <Value>{user.email}</Value>
      </Data>

      <Data>
        <Title>Account Type</Title>
        <Value>{user.accountType}</Value>
      </Data>

      {url ? (
        <Button
          variant="contained"
          color="secondary"
          href={url}
          style={{ marginTop: 20 }}
        >
          Manage my subscription
        </Button>
      ) : null}
    </Page>
  );
}

const Name = styled.h1`
  font-weight: 100;
  font-size: 3em;
  @media screen and (max-width: 500px) {
    font-size: 1.5em;
  }
`;

const Data = styled.div`
  display: flex;
  margin: 15px 0;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.3em;
  width: 200px;
`;

const Value = styled.div`
  font-weight: 100;
  font-size: 1.3em;
`;

export default AccountPage;
