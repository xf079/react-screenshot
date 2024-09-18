import { useMemoizedFn } from 'ahooks';
import { MutableRefObject, useRef } from 'react';
import Konva from 'konva';
import { SHOT_MIN_SIZE } from '../constants';

export interface IShotHandlerOptions {
  isDrawing: MutableRefObject<boolean>;
  shot?: IShotRect;
  mode?: IModeType;
  updateShot: (shot?: IShotRect) => void;
  updateMode: (mode?: IModeType) => void;
}

export const useMouseShotHandler = (options: IShotHandlerOptions) => {
  const { isDrawing, mode, shot, updateShot, updateMode } = options;
  // 开始绘制的位置
  const start = useRef({ x: 0, y: 0 });

  const onShotMouseDownHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (shot) return;
      if (e.evt.button === 0 && !mode) {
        isDrawing.current = true;
        start.current = { x: e.evt.layerX, y: e.evt.layerY };
        updateMode('shot');
        updateShot({
          ...start.current,
          width: 0,
          height: 0
        });
      }
    }
  );

  const onShotMouseMoveHandler = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isDrawing.current) return;
      const { x, y } = start.current;
      const { layerX, layerY } = e.evt;
      updateShot({
        ...start.current,
        x: Math.min(x, layerX),
        y: Math.min(y, layerY),
        width: Math.abs(layerX - x),
        height: Math.abs(layerY - y)
      });
    }
  );

  const onShotMouseOutHandler = useMemoizedFn(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      updateMode(undefined);
      // 截图区域太小，取消截图
      if (
        (shot!.width || 0) < SHOT_MIN_SIZE ||
        (shot!.height || 10) < SHOT_MIN_SIZE
      ) {
        updateShot(undefined);
      }
    }
  });

  return {
    onShotMouseDownHandler,
    onShotMouseMoveHandler,
    onShotMouseOutHandler
  };
};
