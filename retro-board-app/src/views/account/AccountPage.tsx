import React from 'react';
import usePortalUrl from './usePortalUrl';

function AccountPage() {
  const url = usePortalUrl();
  return (
    <div>
      Hello
      <iframe
        title="Stripe portal"
        width="100%"
        height="1000px"
        src={url || undefined}
        seamless
      ></iframe>
    </div>
  );
}

export default AccountPage;
