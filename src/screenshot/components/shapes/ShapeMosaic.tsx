import Konva from 'konva';
import { Line, Transformer } from 'react-konva';
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';

export interface IShapeMosaicProps extends ShapeBaseProps {
  shape: IShapeType;
}

export const ShapeMosaic: FC<IShapeMosaicProps> = ({
  shape,
  selected,
  updateSelected,
  updateMode,
  onUpdateShapeState
}) => {
  const shapeRef = useRef<Konva.Line>(null);
  const shapeTrRef = useRef<Konva.Transformer>(null);
  const [image, setImage] = useState('');

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
    if (shape.options?.pencilMode === 'Color') {
      return undefined;
    }
    if (shape.options?.pencilMode === 'GaussianBlur') {
      return [Konva.Filters.Blur];
    }
    if (shape.options?.pencilMode === 'Mosaic') {
      return [Konva.Filters.Pixelate];
    }
  }, [shape.options?.pencilMode]);

  /**
   * 拖动结束
   * @param e 鼠标事件对象
   */
  const onShapeDragEndFunc = useMemoizedFn(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      updateMode(undefined);
      onUpdateShapeState({
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
        endX: e.target.x() + rectState.width,
        endY: e.target.y() + rectState.height
      });
    }
  );

  useEffect(() => {
    if (selected === shape.id) {
      if (shapeRef.current && shapeTrRef.current) {
        shapeTrRef.current?.nodes([shapeRef.current]);
        shapeTrRef.current?.getLayer()?.batchDraw();
        shapeRef.current?.moveToTop();
        shapeTrRef.current?.moveToTop();
      }
    }
  }, [selected, shape.id]);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current?.cache();
      shapeRef.current?.blurRadius(10);
      shapeRef.current?.getLayer()?.batchDraw();
    }
  }, [shape]);
  return (
    <Fragment>
      <Line
        ref={shapeRef}
        points={shape.continuous}
        filters={filters}
        bezier={false}
        stroke={'rgba(0,0,0,0.5)'}
        strokeWidth={shape.options?.size}
        tension={0}
        lineCap='round'
        lineJoin='round'
        globalCompositeOperation='color-dodge'
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
      />
      {selected === shape.id && (
        <Transformer
          ref={shapeTrRef}
          flipEnabled={true}
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
          onMouseDown={(e) => {
            e.cancelBubble = true;
          }}
        />
      )}
    </Fragment>
  );
};
