import Konva from 'konva';
import { Rect, Transformer } from 'react-konva';
import { FC, Fragment, useContext, useEffect, useMemo, useRef } from 'react';
import { ShotContext } from '@/screenshot/Context';
import { useMemoizedFn } from 'ahooks';

export interface IShapeRectProps {
  shot: IShotRect;
  shape: IShapeType;
  selected?: string;
  onSelected: (id: string) => void;
}

export const ShapeRect: FC<IShapeRectProps> = ({
  shape,
  shot,
  selected,
  onSelected
}) => {
  const { dispatch } = useContext(ShotContext);
  const shapeRef = useRef<Konva.Rect>(null);
  const shapeTrRef = useRef<Konva.Transformer>(null);

  const onRectTap = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (selected !== shape.id) {
      onSelected(shape.id);
    }
  };

  const rectState = useMemo(() => {
    const minX = Math.min(shape?.x || 0, shape.endX || 0);
    const minY = Math.min(shape?.y || 0, shape.endY || 0);
    const maxX = Math.max(shape?.x || 0, shape.endX || 0);
    const maxY = Math.max(shape?.y || 0, shape.endY || 0);
    return {
      x: minX,
      y: minY,
      width: shape.endX !== undefined ? maxX - minX : 0,
      height: shape.endY !== undefined ? maxY - minY : 0
    };
  }, [shape]);

  const hitFunc = (ctx: Konva.Context, _that: Konva.Shape) => {
    const width = _that.width();
    const height = _that.height();
    ctx.beginPath();
    ctx.rect(0, 0, _that.width(), shape.options?.size || 0);
    ctx.rect(0, 0, shape.options?.size || 0, _that.height());
    ctx.rect(width, 0, shape.options?.size || 0, _that.height());
    ctx.rect(0, height, width, shape.options?.size || 0);
    ctx.closePath();
    // important Konva method that fill and stroke shape from its properties
    ctx.fillStrokeShape(_that);
  };

  /**
   * 图形的拖动边界限制
   */
  const onShapeDragBoundFunc = useMemoizedFn((pos: Konva.Vector2d) => {
    if (!shot) return pos;
    let currentX = pos.x;
    let currentY = pos.y;
    const { x, y, width, height } = shot;
    const maxX = x + width - rectState.width;
    const maxY = y + height - rectState.height;
    if (currentX < x) {
      currentX = x;
    }
    if (currentX > maxX) {
      currentX = maxX;
    }
    if (currentY < y) {
      currentY = y;
    }
    if (currentY > maxY) {
      currentY = maxY;
    }

    return { x: currentX, y: currentY };
  });

  /**
   * 拖动结束
   * @param e 鼠标事件对象
   */
  const onShapeDragEndFunc = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      dispatch({ type: 'SET_MODE', payload: undefined });
      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          ...shape,
          x: e.target.x(),
          y: e.target.y(),
          endX: e.target.x() + rectState.width,
          endY: e.target.y() + rectState.height
        }
      });
    }
  );

  useEffect(() => {
    if (selected === shape.id) {
      if (shapeRef.current && shapeTrRef.current) {
        shapeTrRef.current?.nodes([shapeRef.current]);
        shapeTrRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [selected, shape.id]);

  console.log(shape,rectState);
  return (
    <Fragment>
      <Rect
        ref={shapeRef}
        x={rectState.x}
        y={rectState.y}
        index={shape.index}
        width={rectState.width}
        height={rectState.height}
        stroke={shape.options?.color}
        strokeHitEnabled={true}
        strokeWidth={shape.options?.full ? 0 : shape.options?.size}
        fill={shape.options?.full ? shape.options?.color : 'transparent'}
        opacity={(shape.options?.opacity || 0) / 100}
        cornerRadius={shape.options?.radius ? 5 : 0}
        onMouseDown={onRectTap}
        onDragStart={(e) => {
          onRectTap(e);
          dispatch({ type: 'SET_MODE', payload: 'drag' });
        }}
        onDragMove={(e) => {
          e.cancelBubble = true;
        }}
        onDragEnd={onShapeDragEndFunc}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = 'default';
          }
        }}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = 'move';
          }
        }}
        draggable
        dragBoundFunc={onShapeDragBoundFunc}
        hitStrokeWidth={shape.options?.size}
        hitFunc={hitFunc}
      />
      {selected === shape.id && (
        <Transformer
          ref={shapeTrRef}
          flipEnabled={false}
          resizeEnabled={true}
          rotateEnabled={false}
          anchorSize={8}
          anchorStroke='#fff'
          anchorCornerRadius={4}
          borderEnabled={false}
          ignoreStroke={true}
          centeredScaling={false}
          keepRatio={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'middle-left',
            'middle-right',
            'top-center',
            'bottom-center'
          ]}
        />
      )}
    </Fragment>
  );
};
