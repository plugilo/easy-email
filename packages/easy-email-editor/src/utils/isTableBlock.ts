import { BasicType, AdvancedType } from '@plugilo/easy-email-core';

export function isTableBlock(blockType: any) {
  return blockType === AdvancedType.TABLE;
}
