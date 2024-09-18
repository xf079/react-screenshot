import Konva from 'konva';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { SHAPE_MIN_SIZE } from '../constants';

interface IMouseStartType {
  x: number;
  y: number;
  id: string;
  index: number;
}

export interface IShapeHandlerOptions {
  isDrawing: MutableRefObject<boolean>;
  shot?: IShotRect;
  mode?: IModeType;
  index: number;
  shape?: IShapeType;
  action?: IToolActionType;
  updateMode: Dispatch<SetStateAction<IModeType|undefined>>;
  updateIndex: Dispatch<SetStateAction<number>>;
  updateSelected: Dispatch<SetStateAction<string|undefined>>;
  updateShape: Dispatch<SetStateAction<IShapeType | undefined>>;
  updateList: Dispatch<SetStateAction<IShapeType[]>>;
}

export const useMouseShapeHandler = (options: IShapeHandlerOptions) => {
  const {
    isDrawing,
    shot,
    mode,
    index,
    shape,
    action,
    updateMode,
    updateShape,
    updateSelected,
    updateIndex,
    updateList
  } = options;
  // 开始绘制的位置
  const start = useRef<IMouseStartType>();

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
            index: index + 1,
            id: String(Date.now())
          };
          updateSelected(undefined)
          updateMode('shape');
          updateIndex(index + 1);
        }
      }
    }
  );

  const onShapeMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isDrawing.current && start.current && shot) {
        let { layerX: endX, layerY: endY } = e.evt;
        const { x, y, width, height } = shot;
        if (endX <= x) {
          endX = x;
        }
        if (endX >= x + width) {
          endX = x + width;
        }
        if (endY <= y) {
          endY = y;
        }
        if (endY >= y + height) {
          endY = y + height;
        }
        if (
          Math.abs(endX - start.current.x) > SHAPE_MIN_SIZE &&
          Math.abs(endY - start.current.y) > SHAPE_MIN_SIZE &&
          action
        ) {
          updateShape({
            ...action,
            ...start.current,
            endX,
            endY
          });
        }
      }
    }
  );

  const onShapeMouseUpHandler = useMemoizedFn(() => {
    if (isDrawing.current && start.current && shot) {
      isDrawing.current = false;
      start.current = undefined;
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
