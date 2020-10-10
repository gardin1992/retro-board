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
import SettingCategory from './SettingCategory';
import useTranslations from '../../translations';
import useToggle from '../../hooks/useToggle';
import { ColumnSettings, Template } from '../../state/types';
import { buildDefaults } from '../../state/columns';
import { trackEvent } from '../../track';
import OptionItem from './OptionItem';
import MaxVoteSlider from './MaxVoteSlider';
import BooleanOption from './BooleanOption';
import TemplatePicker from './TemplatePicker';
import TemplateEditor from './TemplateEditor';

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
  options,
  columns,
  onChange,
  onClose,
}: SessionEditorProps) {
  const translations = useTranslations();
  const { Customize, Generic } = translations;
  const fullScreen = useMediaQuery('(max-width:600px)');
  const [isDefaultTemplate, toggleIsDefaultTemplate] = useToggle(false);
  const [maxUpVotes, setMaxUpVotes] = useState<number | null>(null);
  const [maxDownVotes, setMaxDownVotes] = useState<number | null>(null);
  const [allowActions, setAllowActions] = useState(true);
  const [allowSelfVoting, setAllowSelfVoting] = useState(false);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [allowAuthorVisible, setAllowAuthorVisible] = useState(false);
  const [allowGiphy, setAllowGiphy] = useState(true);
  const [allowGrouping, setAllowGrouping] = useState(true);
  const [allowReordering, setAllowReordering] = useState(true);
  const [blurCards, setBlurCards] = useState(false);
  const [definitions, setDefinitions] = useState<ColumnSettings[]>(columns);

  useEffect(() => {
    setAllowActions(options.allowActions);
    setAllowAuthorVisible(options.allowAuthorVisible);
    setAllowGiphy(options.allowGiphy);
    setAllowGrouping(options.allowGrouping);
    setAllowMultipleVotes(options.allowMultipleVotes);
    setAllowReordering(options.allowReordering);
    setAllowSelfVoting(options.allowSelfVoting);
    setBlurCards(options.blurCards);
    setMaxDownVotes(options.maxDownVotes);
    setMaxUpVotes(options.maxUpVotes);
  }, [options]);

  useEffect(() => {
    setDefinitions(columns);
  }, [columns]);


  const handleTemplateChange = useCallback(
    (templateType: Template) => {
      const template = buildDefaults(templateType, translations);
      setDefinitions(template);
      trackEvent('custom-modal/template/select');
    },
    [translations]
  );

  const handleCreate = useCallback(() => {
    onChange(
      {
        allowActions,
        allowAuthorVisible,
        allowGiphy,
        allowGrouping,
        allowMultipleVotes,
        allowReordering,
        allowSelfVoting,
        blurCards,
        maxDownVotes,
        maxUpVotes,
      },
      definitions,
      isDefaultTemplate
    );
  }, [
    onChange,
    allowActions,
    allowAuthorVisible,
    allowGiphy,
    allowGrouping,
    allowMultipleVotes,
    allowReordering,
    allowSelfVoting,
    blurCards,
    maxDownVotes,
    maxUpVotes,
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
        <SettingCategory
          title={Customize.customTemplateCategory!}
          subtitle={Customize.customTemplateCategorySub!}
        >
          <OptionItem
            label={Customize.template!}
            help={Customize.templateHelp!}
          >
            <TemplatePicker onSelect={handleTemplateChange} />
          </OptionItem>
          <TemplateEditor columns={definitions} onChange={setDefinitions} />
        </SettingCategory>
        <SettingCategory
          title={Customize.votingCategory!}
          subtitle={Customize.votingCategorySub!}
        >
          <OptionItem
            label={Customize.maxUpVotes!}
            help={Customize.maxUpVotesHelp!}
          >
            <MaxVoteSlider value={maxUpVotes} onChange={setMaxUpVotes} />
          </OptionItem>
          <OptionItem
            label={Customize.maxDownVotes!}
            help={Customize.maxDownVotesHelp!}
          >
            <MaxVoteSlider value={maxDownVotes} onChange={setMaxDownVotes} />
          </OptionItem>
          <OptionItem
            label={Customize.allowSelfVoting!}
            help={Customize.allowSelfVotingHelp!}
          >
            <BooleanOption
              value={allowSelfVoting}
              onChange={setAllowSelfVoting}
            />
          </OptionItem>
          <OptionItem
            label={Customize.allowMultipleVotes!}
            help={Customize.allowMultipleVotesHelp!}
          >
            <BooleanOption
              value={allowMultipleVotes}
              onChange={setAllowMultipleVotes}
            />
          </OptionItem>
        </SettingCategory>
        <SettingCategory
          title={Customize.postCategory!}
          subtitle={Customize.postCategorySub!}
        >
          <OptionItem
            label={Customize.allowActions!}
            help={Customize.allowActionsHelp!}
          >
            <BooleanOption value={allowActions} onChange={setAllowActions} />
          </OptionItem>
          <OptionItem
            label={Customize.allowAuthorVisible!}
            help={Customize.allowAuthorVisibleHelp!}
          >
            <BooleanOption
              value={allowAuthorVisible}
              onChange={setAllowAuthorVisible}
            />
          </OptionItem>
          <OptionItem
            label={Customize.allowReordering!}
            help={Customize.allowReorderingHelp!}
          >
            <BooleanOption
              value={allowReordering}
              onChange={setAllowReordering}
            />
          </OptionItem>
          <OptionItem
            label={Customize.allowGrouping!}
            help={Customize.allowGroupingHelp!}
          >
            <BooleanOption value={allowGrouping} onChange={setAllowGrouping} />
          </OptionItem>
          <OptionItem
            label={Customize.allowGiphy!}
            help={Customize.allowGiphyHelp!}
          >
            <BooleanOption value={allowGiphy} onChange={setAllowGiphy} />
          </OptionItem>
          <OptionItem
            label={Customize.blurCards!}
            help={Customize.blurCardsHelp!}
          >
            <BooleanOption value={blurCards} onChange={setBlurCards} />
          </OptionItem>
        </SettingCategory>
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
