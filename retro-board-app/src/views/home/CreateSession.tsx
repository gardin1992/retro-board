import React, { useCallback, useMemo } from 'react';
import {
  SessionOptions,
  ColumnDefinition,
  defaultOptions,
} from 'retro-board-common';
import { buildDefaults, merge } from '../../state/columns';
import { ColumnSettings } from '../../state/types';
import useTranslations from '../../translations';
import { trackEvent } from './../../track';
import SessionEditor from '../session-editor/SessionEditor';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
  onLaunch: (
    options: SessionOptions,
    columns: ColumnDefinition[],
    makeDefault: boolean
  ) => void;
}

const CreateSessionModal = ({
  open,
  onClose,
  onLaunch,
}: CreateSessionModalProps) => {
  const translations = useTranslations();
  const defaultDefinitions = useMemo(() => {
    return buildDefaults('default', translations);
  }, [translations]);

  const handleChange = useCallback(
    (
      options: SessionOptions,
      columns: ColumnSettings[],
      makeDefault: boolean
    ) => {
      const numberOfColumns = 5;
      console.log('Options: ', options, 'Columns: ', columns);
      trackEvent('custom-modal/create');
      if (makeDefault) {
        trackEvent('custom-modal/template/set-defaut');
      }
      onLaunch(
        options,
        merge(columns, defaultDefinitions, numberOfColumns),
        makeDefault
      );
    },
    [onLaunch, defaultDefinitions]
  );

  return (
    <SessionEditor
      columns={defaultDefinitions}
      options={defaultOptions}
      onChange={handleChange}
      open={open}
      onClose={onClose}
    />
  );
};

export default CreateSessionModal;
