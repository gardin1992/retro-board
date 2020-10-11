import React, { useState, useCallback } from 'react';
import useGlobalState from '../../state';
import { Button } from '@material-ui/core';
import SessionEditor from '../session-editor/SessionEditor';
import { ColumnSettings } from '../../state/types';
import { SessionOptions } from 'retro-board-common';

interface ModifyOptionsProps {
  onEditOptions: (options: SessionOptions) => void;
}

function ModifyOptions({ onEditOptions }: ModifyOptionsProps) {
  const [open, setOpen] = useState(false);
  const { state } = useGlobalState();

  const handleChange = useCallback(
    (
      options: SessionOptions,
      columns: ColumnSettings[],
      makeDefault: boolean
    ) => {
      setOpen(false);
      onEditOptions(options);
    },
    [onEditOptions]
  );

  if (!state.session) {
    return null;
  }
  const options = state.session.options;
  const columns = state.session.columns;

  return (
    <>
      <Button onClick={() => setOpen(true)}>Options</Button>
      <SessionEditor
        open={open}
        columns={columns}
        options={options}
        onClose={() => setOpen(false)}
        onChange={handleChange}
      />
    </>
  );
}

export default ModifyOptions;
