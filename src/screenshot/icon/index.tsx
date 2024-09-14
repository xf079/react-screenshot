import {
  Square,
  Circle,
  Slash,
  MoveUpRight,
  Pencil,
  Blend,
  Type,
  Pin,
  CornerDownLeft,
  X,
  ArrowDownToLine,
  Check,
  LucideProps
} from 'lucide-react';
import React from 'react';

export const ToolIconList: Record<
  IOptionsKeyType,
  React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
> = {
  Rect: Square,
  Circle: Circle,
  Line: Slash,
  Arrow: MoveUpRight,
  Pencil: Pencil,
  Mosaic: Blend,
  Text: Type,
  Pinned: Pin,
  Refresh: CornerDownLeft,
  Close: X,
  Download: ArrowDownToLine,
  Success: Check
};
