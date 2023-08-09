import React, { useMemo } from 'react';
import { useFocusIdx } from '@plugilo/easy-email-editor';
import { RadioGroupField } from '../../../components/Form';

const options = [
  {
    value: 'left',
    get label() {
      return t('Left');
    },
  },
  {
    value: 'center',
    get label() {
      return t('Center');
    },
  },
  {
    value: 'right',
    get label() {
      return t('Right');
    },
  },
];

export function Align({ inline, justify }: { inline?: boolean; justify?: boolean }) {
  const { focusIdx } = useFocusIdx();

  const ratioOptions = useMemo(() => {
    if (!justify) return options;

    return [
      ...options,
      {
        value: 'justify',
        get label() {
          return t('Justify');
        },
      },
    ];
  }, [justify]);

  return (
    <RadioGroupField
      label={t('Align')}
      name={`${focusIdx}.attributes.align`}
      options={ratioOptions}
    />
  );
}
