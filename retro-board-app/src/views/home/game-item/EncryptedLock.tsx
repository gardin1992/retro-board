import { colors, Tooltip } from '@material-ui/core';
import { Lock, LockOpen } from '@material-ui/icons';
import React from 'react';
import { SessionMetadata } from 'retro-board-common';
import { CHECK_PREFIX, decrypt } from '../../../crypto/crypto';
import { useEncryptionKey } from '../../../crypto/useEncryptionKey';

interface EncryptedLockProps {
  session: SessionMetadata;
}

function EncryptedLock({ session }: EncryptedLockProps) {
  const [key] = useEncryptionKey(session.id);

  if (!session.encrypted) {
    return null;
  }

  if (!key) {
    return (
      <Tooltip title="This session is encrypted, and the key is not stored in your browser. You will be asked for the decryption key when opening this session">
        <Lock color="error" />
      </Tooltip>
    );
  }

  if (decrypt(session.encrypted, key) !== CHECK_PREFIX) {
    return (
      <Tooltip title="This session is encrypted, and the key you have stored is not the correct key">
        <Lock color="error" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="This session is encrypted, and the key is stored in your browser. You can open this session without having to provide the password again.">
      <LockOpen htmlColor={colors.green[500]} />
    </Tooltip>
  );
}

export default EncryptedLock;
