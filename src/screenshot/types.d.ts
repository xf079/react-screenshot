interface IShotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type IModeType = 'shot'|'shape'|'drag'

interface IToolRectType{
  x: number;
  y: number;
  position: 'top'|'bottom'
}

interface IShapeOption {
  size?: number;
  opacity?: number;
  color?: string;
  full?: boolean;
  radius?: boolean;
}

type IOptionActionKey =
  | 'Rect'
  | 'Circle'
  | 'Line'
  | 'Arrow'
  | 'Pencil'
  | 'Mosaic'
  | 'Text';

type IOptionsKeyType =
  | IOptionActionKey
  | 'Pinned'
  | 'Refresh'
  | 'Close'
  | 'Download'
  | 'Success';

interface IToolType {
  type: IOptionActionKey;
  title?: string;
  width: number;
  height: number;
  options?: IShapeOption;
}

interface IToolSimpleType {
  type: IOptionsKeyType;
  width: number;
  height: number;
}

type IToolOptionsType = Record<IOptionActionKey, IShapeOption>;

interface ISelectToolOptionType {
  type: IOptionsKeyType;
  options?: IOptionShape;
}

interface IShapeType {
  id: string;
  type: IOptionsKeyType;
  options?: IShapeOption;
  index: number;
  x: number;
  y: number;
  endX: number;
  endY: number;
}



interface IToolActionType{
  type: IOptionsKeyType;
  options?: IOptionShape;
}