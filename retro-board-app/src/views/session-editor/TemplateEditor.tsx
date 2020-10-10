import React, { useCallback } from 'react';
import { ColumnSettings } from '../../state/types';
import ColumnEditor from './ColumnEditor';
import useTranslation from '../../translations/useTranslations';
import { getTemplateColumnByType } from '../../state/columns';
import { Button } from '@material-ui/core';

const MAX_NUMBER_OF_COLUMNS = 5;

interface TemplateEditorProps {
  columns: ColumnSettings[];
  onChange: (columns: ColumnSettings[]) => void;
}

function TemplateEditor({ columns, onChange }: TemplateEditorProps) {
  const translations = useTranslation();
  const handleColumnChange = useCallback((value: ColumnSettings, index: number) => {
    onChange(Object.assign([], columns, { [index]: value }))
  }, [onChange, columns]);
  const handleAddColumn = useCallback(() => {
    const custom = getTemplateColumnByType(translations)('custom');
    onChange([...columns, custom]);
  }, [onChange, columns, translations]);
  const handleRemoveColumn  =useCallback((column: ColumnSettings) => {
    onChange(columns.filter(c => c!== column));
  }, [onChange, columns]);
  return (
    <>
    {columns.map((def, index) => (
      <ColumnEditor
        key={index}
        value={def}
        defaults={columns[index]}
        onChange={(value) => handleColumnChange(value, index)}
        onRemove={handleRemoveColumn}
      />
    ))}
    {columns.length < MAX_NUMBER_OF_COLUMNS ? <Button onClick={handleAddColumn}>Add</Button> : null}
    </>
  )
}

export default TemplateEditor;