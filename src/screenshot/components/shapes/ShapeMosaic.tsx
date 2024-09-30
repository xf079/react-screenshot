import Konva from 'konva';
import { Group, Image, Rect } from 'react-konva';
import { FC, Fragment, useEffect, useMemo, useRef } from 'react';

export interface IShapeMosaicProps extends ShapeBaseProps {
  shape: IShapeType;
  image: HTMLImageElement;
}

export const ShapeMosaic: FC<IShapeMosaicProps> = ({
  shape,
  selected,
  image,
  updateSelected
}) => {
  const shapeRef = useRef<Konva.Image>(null);

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

  const filters = useMemo(() => {
    if (shape.options?.pencilMode === 'GaussianBlur') {
      return [Konva.Filters.Blur];
    }
    if (shape.options?.pencilMode === 'Mosaic') {
      return [Konva.Filters.Pixelate];
    }
  }, [shape.options?.pencilMode]);

  useEffect(() => {
    shapeRef.current?.cache();
  }, []);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current?.blurRadius(shape.options?.size || 10);
      shapeRef.current?.pixelSize(shape.options?.size || 10);
      shapeRef.current?.getLayer()?.batchDraw();
    }
  }, [shape]);

  return (
    <Fragment>
      <Group
        x={rectState.x}
        y={rectState.y}
        width={rectState.width}
        height={rectState.height}
        clipX={0}
        clipY={0}
        clipWidth={rectState.width}
        clipHeight={rectState.height}
      >
        <Image
          ref={shapeRef}
          image={image}
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          filters={filters}
        />
      </Group>
      <Rect
        x={rectState.x}
        y={rectState.y}
        width={rectState.width}
        height={rectState.height}
        stroke='#ddd'
        dash={[3, 3]}
        strokeWidth={selected === shape.id ? 1 : 0}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          updateSelected(shape.id);
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
            stage.container().style.cursor = 'pointer';
          }
        }}
      />
    </Fragment>
  );
};
