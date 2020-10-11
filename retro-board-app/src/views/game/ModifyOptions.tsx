import React, { useState, useCallback } from 'react';
import useGlobalState from '../../state';
import { Button } from '@material-ui/core';
import SessionEditor from '../session-editor/SessionEditor';
import { ColumnSettings } from '../../state/types';
import { SessionOptions, ColumnDefinition } from 'retro-board-common';
import { toColumnDefinitions } from '../../state/columns';
import { trackEvent } from '../../track';

interface ModifyOptionsProps {
  onEditOptions: (options: SessionOptions) => void;
  onEditColumns: (columns: ColumnDefinition[]) => void;
}

function ModifyOptions({ onEditOptions, onEditColumns }: ModifyOptionsProps) {
  const [open, setOpen] = useState(false);
  const { state } = useGlobalState();

  const handleChange = useCallback(
    (
      updatedOptions: SessionOptions,
      updatedColumns: ColumnSettings[],
      _: boolean
    ) => {
      setOpen(false);
      // TODO: make these conditional
      if (!state.session) {
        return;
      }
      const { options, columns } = state.session;
      if (options !== updatedOptions) {
        onEditOptions(options);
        trackEvent('game/session/edit-options');
      }
      if (columns !== updatedColumns) {
        onEditColumns(toColumnDefinitions(columns));
        trackEvent('game/session/edit-columns');
      }
    },
    [onEditOptions, onEditColumns, state]
  );

  if (!state.session) {
    return null;
  }

  const { options, columns } = state.session;

  return (
    <>
      <Button onClick={() => setOpen(true)}>Options</Button>
      <SessionEditor
        edit
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
