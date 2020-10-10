import React, { useState, useEffect, useCallback } from 'react';
import { SessionOptions } from 'retro-board-common';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import useTranslations from '../../translations';
import useToggle from '../../hooks/useToggle';
import { ColumnSettings } from '../../state/types';
import TemplateSection from './sections/template/TemplateSection';
import PostsSection from './sections/posts/PostsSection';
import VotingSection from './sections/votes/VotingSection';

interface SessionEditorProps {
  open: boolean;
  options: SessionOptions;
  columns: ColumnSettings[];
  onChange: (
    options: SessionOptions,
    columns: ColumnSettings[],
    makeDefault: boolean
  ) => void;
  onClose: () => void;
}

function SessionEditor({
  open,
  options: incomingOptions,
  columns,
  onChange,
  onClose,
}: SessionEditorProps) {
  const translations = useTranslations();
  const { Customize, Generic } = translations;
  const fullScreen = useMediaQuery('(max-width:600px)');
  const [isDefaultTemplate, toggleIsDefaultTemplate] = useToggle(false);
  const [definitions, setDefinitions] = useState<ColumnSettings[]>(columns);
  const [options, setOptions] = useState(incomingOptions);

  useEffect(() => {
    setDefinitions(columns);
  }, [columns]);

  useEffect(() => {
    setOptions(options);
  }, [options]);


  const handleCreate = useCallback(() => {
    onChange(
      options,
      definitions,
      isDefaultTemplate
    );
  }, [
    onChange,
    options,
    definitions,
    isDefaultTemplate,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      keepMounted={false}
    >
      <DialogTitle>{Customize.title}</DialogTitle>
      <DialogContent>
        <TemplateSection columns={definitions} onChange={setDefinitions} />
        <VotingSection options={options} onChange={setOptions} />
        <PostsSection options={options} onChange={setOptions} />
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDefaultTemplate}
              onChange={toggleIsDefaultTemplate}
            />
          }
          label={Customize.makeDefaultTemplate}
        />
        <Button onClick={onClose} color="default" variant="text">
          {Generic.cancel}
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          {Customize.startButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SessionEditor;
