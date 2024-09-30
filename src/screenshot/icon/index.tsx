import {
  Square,
  Circle,
  Slash,
  MoveUpRight,
  Type,
  Pin,
  CornerDownLeft,
  X,
  ArrowDownToLine,
  Check,
} from 'lucide-react';
import MosaicIcon from './icon-mosaic.svg?react';
import PencilIcon from './icon-pencil.svg?react'

export const ToolIconList: Record<IOptionsKeyType, any> = {
  Rect: Square,
  Circle: Circle,
  Line: Slash,
  Arrow: MoveUpRight,
  Pencil: PencilIcon,
  Mosaic: MosaicIcon,
  Text: Type,
  Pinned: Pin,
  Refresh: CornerDownLeft,
  Close: X,
  Download: ArrowDownToLine,
  Success: Check
};
