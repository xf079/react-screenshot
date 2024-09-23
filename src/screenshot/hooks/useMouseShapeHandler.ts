import Konva from 'konva';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { SHAPE_MIN_SIZE } from '../constants';

interface IMouseStartType {
  x: number;
  y: number;
  id: string;
}

export interface IShapeHandlerOptions {
  isDrawing: MutableRefObject<boolean>;
  shot?: IShotRect;
  mode?: IModeType;
  shape?: IShapeType;
  action?: IToolActionType;
  updateMode: Dispatch<SetStateAction<IModeType | undefined>>;
  updateSelected: Dispatch<SetStateAction<string | undefined>>;
  updateShape: Dispatch<SetStateAction<IShapeType | undefined>>;
  updateList: Dispatch<SetStateAction<IShapeType[]>>;
}

export const useMouseShapeHandler = (options: IShapeHandlerOptions) => {
  const {
    isDrawing,
    shot,
    mode,
    shape,
    action,
    updateMode,
    updateShape,
    updateSelected,
    updateList
  } = options;
  // 开始绘制的位置
  const start = useRef<IMouseStartType>();

  const continuousRef = useRef<number[]>([]);

  /**
   * 开始绘制自定义图形
   */
  const onShapeMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 0 && shot && !mode) {
        const x = e.evt.layerX;
        const y = e.evt.layerY;
        const { x: rectX, y: rectY, width, height } = shot;
        // 判断点击位置是否在截图区域内
        if (
          x >= rectX! &&
          x <= rectX! + width! &&
          y >= rectY! &&
          y <= rectY! + height! &&
          action
        ) {
          isDrawing.current = true;
          start.current = {
            x: e.evt.layerX,
            y: e.evt.layerY,
            id: String(Date.now())
          };
          continuousRef.current = [e.evt.layerX, e.evt.layerY];
          updateSelected(undefined);
          updateMode('shape');
        }
      }
    }
  );

  const onShapeMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isDrawing.current && start.current && shot) {
        const { layerX: endX, layerY: endY } = e.evt;
        if (
          Math.abs(endX - start.current.x) > SHAPE_MIN_SIZE &&
          Math.abs(endY - start.current.y) > SHAPE_MIN_SIZE &&
          action
        ) {
          if (action.type === 'Pencil') {
            continuousRef.current.push(endX, endY);
            updateShape({
              ...action,
              ...start.current,
              continuous: continuousRef.current,
              endX,
              endY
            });
          } else {
            updateShape({
              ...action,
              ...start.current,
              endX,
              endY
            });
          }
        }
      }
    }
  );

  const onShapeMouseUpHandler = useMemoizedFn(() => {
    if (isDrawing.current && start.current && shot) {
      isDrawing.current = false;
      start.current = undefined;
      continuousRef.current = [];
      updateMode(undefined);
      if (shape) {
        updateList((prevState) => {
          return [...prevState, shape];
        });
        updateShape(undefined);
      }
    }
  });

  return {
    isDrawing,
    onShapeMouseDownHandler,
    onShapeMouseMoveHandler,
    onShapeMouseUpHandler
  };
};
