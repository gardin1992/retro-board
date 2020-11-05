import React, { useCallback } from 'react';
import ChipInput from 'material-ui-chip-input';
import useStateFetch from '../../hooks/useStateFetch';
import { updateMembers } from './api';

function MembersEditor() {
  const [members, setMembers] = useStateFetch<string[] | null>(
    '/api/stripe/members',
    null
  );
  const handleAdd = useCallback(
    (value: string) => {
      if (members && !members.includes(value)) {
        setMembers((prev) => {
          const updated = [...(prev || []), value];
          updateMembers(updated);
          return updated;
        });
      }
    },
    [members, setMembers]
  );
  const handleRemove = useCallback(
    (value: string) => {
      if (members && members.includes(value)) {
        setMembers((prev) => {
          const updated = prev ? prev.filter((v) => v !== value) : null;
          if (updated) {
            updateMembers(updated);
          }
          return updated;
        });
      }
    },
    [members, setMembers]
  );

  if (members === null) {
    return null;
  }

  return (
    <div>
      <ChipInput value={members} onAdd={handleAdd} onDelete={handleRemove} />
    </div>
  );
}

export default MembersEditor;
