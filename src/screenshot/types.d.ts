import { Dispatch, SetStateAction } from 'react';

export {};

declare global {
  interface IPosition {
    x: number;
    y: number;
  }

  interface IToolPosition extends IPosition{
    position: 'top' | 'bottom';
  }

  interface IShotRect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  type IModeType = 'shot' | 'shape' | 'drag';


  interface IShapeOption {
    size?: number;
    opacity?: number;
    color?: string;
    full?: boolean;
    radius?: boolean;
    pencilMode?: 'GaussianBlur' | 'Mosaic';
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
    x: number;
    y: number;
    endX: number;
    endY: number;
    continuous?: number[];
  }

  interface IToolActionType {
    type: IOptionsKeyType;
    options?: IOptionShape;
  }

  interface ShapeBaseProps {
    shot: IShotRect;
    mode?: IModeType;
    selected?: string;
    updateSelected: Dispatch<SetStateAction<string | undefined>>;
    updateMode: Dispatch<SetStateAction<IModeType | undefined>>;
    onUpdateShapeState: (shape: IShapeType) => void;
  }

  interface IOptionCommonProps{
    options?: IShapeOption;
    defaultOptions?: IShapeOption;
    onUpdateOptions: (options: IShapeOption) => void;
  }
}
