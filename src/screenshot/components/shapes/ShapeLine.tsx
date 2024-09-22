import Konva from 'konva';
import { Circle, Group, Line } from 'react-konva';
import { FC, Fragment, useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

export interface IShapeLineProps extends ShapeBaseProps {
  shape: IShapeType;
}

export const ShapeLine: FC<IShapeLineProps> = ({
  shape,
  selected,
  updateSelected,
  updateMode,
  onUpdateShapeState
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const shapeRef = useRef<Konva.Arrow>(null);

  const onShapeDragEndFunc = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      updateMode(undefined);
      // @ts-ignore
      const points = shapeRef.current?.points();
      if (!points) return;
      onUpdateShapeState({
        ...shape,
        x: points[0],
        y: points[1],
        endX: points[2],
        endY: points[3]
      });
    }
  );

  useEffect(() => {
    if (selected === shape.id) {
      if (groupRef.current) {
        groupRef.current?.moveToTop();
      }
    }
  }, [selected, shape.id]);

  return (
    <Group
      ref={groupRef}
      draggable
      onMouseDown={(e) => {
        e.cancelBubble = true;
        updateSelected(shape.id);
      }}
      onDragStart={(e) => {
        e.cancelBubble = true;
        updateSelected(shape.id);
        updateMode('drag');
      }}
      onDragMove={(e) => {
        e.cancelBubble = true;
      }}
      onDragEnd={onShapeDragEndFunc}
    >
      <Line
        ref={shapeRef}
        points={[shape.x, shape.y, shape.endX, shape.endY]}
        stroke={shape.options?.color}
        fillEnabled={shape.options?.full}
        strokeWidth={shape.options?.full ? 0 : shape.options?.size}
        fill={shape.options?.full ? shape.options?.color : 'transparent'}
        opacity={(shape.options?.opacity || 0) / 100}
        strokeScaleEnabled={false}
        hitStrokeWidth={shape.options?.size}
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
      />
      {selected === shape.id && (
        <Fragment>
          <Circle
            id='start'
            x={shape.x}
            y={shape.y}
            width={8}
            height={8}
            stroke='red'
            strokeWidth={2}
            radius={5}
            fill='#ffffff'
            draggable
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              if (stage) {
                stage.container().style.cursor = 'move';
              }
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) {
                stage.container().style.cursor = 'default';
              }
            }}
            onDragStart={(e) => {
              e.cancelBubble = true;
            }}
            onDragMove={(e) => {
              e.cancelBubble = true;
              onUpdateShapeState({
                ...shape,
                x: e.target.x(),
                y: e.target.y()
              });
            }}
          />
          <Circle
            id='end'
            x={shape.endX}
            y={shape.endY}
            width={8}
            height={8}
            stroke='red'
            strokeWidth={2}
            radius={5}
            fill='#ffffff'
            draggable
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              if (stage) {
                stage.container().style.cursor = 'move';
              }
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) {
                stage.container().style.cursor = 'default';
              }
            }}
            onDragStart={(e) => {
              e.cancelBubble = true;
            }}
            onDragMove={(e) => {
              e.cancelBubble = true;
              onUpdateShapeState({
                ...shape,
                endX: e.target.x(),
                endY: e.target.y()
              });
            }}
          />
        </Fragment>
      )}
    </Group>
  );
};
