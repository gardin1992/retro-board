import React, { useState, useCallback } from 'react';
import useGlobalState from '../../state';
import { Button } from '@material-ui/core';
import SessionEditor from '../session-editor/SessionEditor';
import { ColumnSettings } from '../../state/types';
import { SessionOptions, ColumnDefinition } from 'retro-board-common';
import { toColumnDefinitions } from '../../state/columns';

interface ModifyOptionsProps {
  onEditOptions: (options: SessionOptions) => void;
  onEditColumns: (columns: ColumnDefinition[]) => void;
}

function ModifyOptions({ onEditOptions, onEditColumns }: ModifyOptionsProps) {
  const [open, setOpen] = useState(false);
  const { state } = useGlobalState();

  const handleChange = useCallback(
    (options: SessionOptions, columns: ColumnSettings[], _: boolean) => {
      setOpen(false);
      // TODO: make these conditional
      onEditOptions(options);
      onEditColumns(toColumnDefinitions(columns));
    },
    [onEditOptions, onEditColumns]
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
