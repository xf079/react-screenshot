import Konva from 'konva';
import { Line } from 'react-konva';
import { FC, Fragment, useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

export interface IShapePencilProps extends ShapeBaseProps {
  shape: IShapeType;
}

export const ShapePencil: FC<IShapePencilProps> = ({
  shape,
  selected,
  updateSelected,
  updateMode,
  onUpdateShapeState
}) => {
  const shapeRef = useRef<Konva.Line>(null);

  /**
   * 拖动结束
   * @param e 鼠标事件对象
   */
  const onShapeDragEndFunc = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      updateMode(undefined);
      const x = e.target.getAttr('x') as number;
      const y = e.target.getAttr('y') as number;
      onUpdateShapeState({
        ...shape,
        x: x,
        y: y
      });
    }
  );

  useEffect(() => {
    if (selected === shape.id) {
      if (shapeRef.current) {
        shapeRef.current?.moveToTop();
      }
    }
  }, [selected, shape.id]);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current?.getLayer()?.batchDraw();
    }
  }, [shape]);
  return (
    <Fragment>
      <Line
        ref={shapeRef}
        points={shape.continuous}
        bezier={false}
        stroke={shape.options?.color}
        strokeWidth={shape.options?.size}
        opacity={(shape.options?.opacity || 0) / 100}
        tension={0}
        x={shape.x}
        y={shape.y}
        lineCap='round'
        lineJoin='round'
        onMouseDown={(e) => {
          e.cancelBubble = true;
        }}
        onDragStart={(e) => {
          e.cancelBubble = true;
          updateSelected(shape.id);
          updateMode('drag');
        }}
        onDragMove={(e) => {
          e.cancelBubble = true;
        }}
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
        onDragEnd={onShapeDragEndFunc}
      />
    </Fragment>
  );
};
