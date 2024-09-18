import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';
import { useState } from 'react';

export interface IShotBoundHandlerOptions {
  width: number;
  height: number;
  shot?: IShotRect;
  updateShot: (rect: IShotRect) => void;
}

export const useShotBoundHandler = (options: IShotBoundHandlerOptions) => {
  const { width, height, shot, updateShot } = options;
  /**
   * 是否正在拖动截图区域
   */
  const [isDragMove, setIsDragMove] = useState(false);

  /**
   * 截图区域的鼠标拖动开始事件
   */
  const onShotDragStart = () => {
    setIsDragMove(true);
  };

  /**
   * 截图区域的鼠标拖动结束事件
   * @param e 鼠标事件对象
   */
  const onShotDragEnd = (e: Konva.KonvaEventObject<Event>) => {
    const target = e.target;
    updateShot({
      x: target.x(),
      y: target.y(),
      width: target.width(),
      height: target.height()
    });
    if (isDragMove) {
      setIsDragMove(false);
    }
  };

  /**
   * 截图区域的拖动边界限制
   */
  const onShotDragBoundFunc = useMemoizedFn((pos: Konva.Vector2d) => {
    let { x, y } = pos;
    if (!shot) return { x, y };
    const { width: shotW = 0, height: shotH = 0 } = shot;
    const maxX = width - shotW;
    const maxY = height - shotH;
    if (x < 0) {
      x = 0;
    } else if (x > maxX) {
      x = maxX;
    }
    if (y < 0) {
      y = 0;
    } else if (y > maxY) {
      y = maxY;
    }
    return { x, y };
  });

  const onShotTransformStart = () => {
    setIsDragMove(true);
  };

  /**
   * 截图区域变换结束更新区域数据
   */
  const onShotTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const target = e.target;
    if (target) {
      const scaleX = Math.abs(target.scaleX());
      const scaleY = Math.abs(target.scaleY());
      target.scaleX(1);
      target.scaleY(1);
      updateShot({
        x: target.x(),
        y: target.y(),
        width: Math.max(5, target.width() * scaleX),
        height: Math.max(5, target.height() * scaleY)
      });
      setIsDragMove(false);
    }
  };

  return {
    isDragMove,
    onShotDragStart,
    onShotDragEnd,
    onShotDragBoundFunc,
    onShotTransformStart,
    onShotTransformEnd
  };
};
