import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import Konva from 'konva';
import { ConfigProvider } from 'antd';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMouseShotHandler } from './hooks/useMouseShotHandler';
import { useMouseShapeHandler } from './hooks/useMouseShapeHandler';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { useShotBoundHandler } from './hooks/useShotBoundHandler';
import { ShotMousePreviewRect } from './components/ShotMousePreviewRect';
import { ShotSizeContainer } from './components/ShotSizeContainer';
import { ShotToolsContainer } from './components/ShotToolsContainer';
import { Shapes } from './components/shapes';
import { ToolList } from './config';
import {
  SHOT_TOOLBAR_HEIGHT,
  SHOT_TOOLBAR_MODAL_HEIGHT,
  SHOT_TOOLBAR_SPLIT,
  SHOT_TOOLBAR_WIDTH
} from './constants';
import { showInsetEffect } from '@/screenshot/util/ware-inset-effect.ts';
import { useStore } from './store';

export interface ScreenShotProps {
  image: string;
  width: number;
  height: number;
  onSuccess?: (image: string) => void;
  onDownload?: (image: string) => void;
  onPinned?: (image: string) => void;
  onClose?: () => void;
}

const ScreenShot: FC<ScreenShotProps> = ({
  image,
  width,
  height,
  onSuccess
}) => {
  const source = useRef(new window.Image());
  const stageRef = useRef<Konva.Stage>(null);
  const [ready, setReady] = useState(false);

  const {
    shot,
    action,
    list,
    mode,
    shadow,
    radius,
    selected,
    updateSelected,
    init,
    updateShot,
    updateMode,
    addShape,
    updateAction
  } = useStore();

  const [tools, updateTools] = useState<IToolType[]>(ToolList);

  // 是否开始绘制截图区域
  const isDrawing = useRef(false);

  /**
   * 当前绘制的图形
   */
  const [shape, updateShape] = useState<IShapeType>();

  const shotRef = useRef<Konva.Rect>(null);
  const shotTrRef = useRef<Konva.Transformer>(null);

  const { pos, color, preview, onMouseColorMoveHandler } =
    useMousePreviewColor();

  const {
    isDragMove,
    onShotDragStart,
    onShotDragEnd,
    onShotDragBoundFunc,
    onShotTransformStart,
    onShotTransformEnd
  } = useShotBoundHandler({
    width,
    height,
    shot,
    updateShot
  });

  const {
    onShotMouseDownHandler,
    onShotMouseMoveHandler,
    onShotMouseOutHandler
  } = useMouseShotHandler({
    isDrawing
  });
  const {
    onShapeMouseDownHandler,
    onShapeMouseMoveHandler,
    onShapeMouseUpHandler
  } = useMouseShapeHandler({
    isDrawing
  });

  const shapes = useMemo(
    () => (shape ? [...list, shape] : list),
    [list, shape]
  );

  const onSaveShotImage = useMemoizedFn(() => {
    if (stageRef.current && shot) {
      const layers = stageRef.current.getLayers();
      const imageLayer = layers[0];
      const imageData = imageLayer
        .getContext()
        .getImageData(shot.x, shot.y, shot.width, shot.height);
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      ctx?.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }
  });

  // const onDownloadHandler = useMemoizedFn(() => {});
  //
  // const onCloseHanlder = () => {};
  //
  // const onPinnedHandler = useMemoizedFn(() => {});

  const onSelectActon = useMemoizedFn((tool: IToolActionType) => {
    if (tool.options) {
      updateAction(tool);
    } else {
      // updateAction(tool);
      console.log(tool);
      switch (tool.type) {
        case 'Success': {
          const url = onSaveShotImage();
          if (url) {
            onSuccess?.(url);
          }
          break;
        }
        case 'Refresh':
          break;
        case 'Close':
          alert('close');
          break;
        case 'Download':
          break;
      }
    }
  });
  useUpdateEffect(() => {
    if (selected) {
      const _shape = shapes.find((item) => item.id === selected);
      if (_shape) {
        updateAction({
          type: _shape.type,
          options: _shape.options
        });
      }
    }
  }, [selected]);

  useEffect(() => {
    if (shot && shotRef.current && shotTrRef.current) {
      shotTrRef.current?.nodes([shotRef.current]);
      shotTrRef.current?.getLayer()?.batchDraw();
    }
  }, [shot]);

  useEffect(() => {
    source.current.src = image;
    source.current.onload = () => {
      setReady(true);
      init(width, height);
    };
  }, [image]);

  return (
    <ConfigProvider
      variant='filled'
      wave={{
        showEffect: showInsetEffect
      }}
      componentSize='small'
    >
      <div className='relative select-none'>
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={(e) => {
            if (!shot) {
              onShotMouseDownHandler(e);
            } else {
              onShapeMouseDownHandler(e);
            }
          }}
          onMouseMove={(e) => {
            if (!shot) {
              onMouseColorMoveHandler(e);
            } else {
              if (mode === 'shot') {
                onShotMouseMoveHandler(e);
              } else if (mode === 'shape') {
                onShapeMouseMoveHandler(e);
              }
            }
          }}
          onMouseUp={() => {
            if (mode === 'shot') {
              onShotMouseOutHandler();
            }
            if (mode === 'shape') {
              onShapeMouseUpHandler();
            }
          }}
        >
          <Layer>
            {ready && (
              <Image
                image={source.current}
                width={width}
                height={height}
                listening={false}
              />
            )}
            {/*{shot && (
              <Shapes
                list={shapes}
                shot={shot}
                mode={mode}
                image={source.current}
                width={width}
                height={height}
                selected={selected}
                updateMode={updateMode}
                updateSelected={updateSelected}
                onUpdateShapeState={onUpdateShapeStateHandler}
              />
            )}*/}
          </Layer>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              listening={!shot}
              fill='rgba(0,0,0,0.6)'
            />
            {shot ? (
              <Fragment>
                <Rect
                  ref={shotRef}
                  width={shot.width}
                  height={shot.height}
                  x={shot.x}
                  y={shot.y}
                  listening={!shot}
                  fill='rgba(0,0,0,0.91)'
                  draggable={!action}
                  cornerRadius={radius}
                  shadowColor='#000'
                  shadowEnabled={shadow}
                  globalCompositeOperation='destination-out'
                  dragBoundFunc={onShotDragBoundFunc}
                  onDragStart={onShotDragStart}
                  onDragEnd={onShotDragEnd}
                />
                <Transformer
                  ref={shotTrRef}
                  resizeEnabled={true}
                  rotateEnabled={false}
                  anchorSize={8}
                  anchorFill='#ffffff'
                  anchorStroke='#ffffff'
                  anchorCornerRadius={6}
                  ignoreStroke={true}
                  borderStroke='#1677ff'
                  borderStrokeWidth={1}
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
                  onTransformStart={onShotTransformStart}
                  onTransformEnd={onShotTransformEnd}
                />
              </Fragment>
            ) : null}
            {preview && color && pos && !shot ? (
              <ShotMousePreviewRect
                pos={pos}
                color={color}
                image={preview}
                primaryColor='#1677ff'
              />
            ) : null}
          </Layer>
        </Stage>
        {shot && <ShotSizeContainer />}
        {!isDragMove && shot && <ShotToolsContainer tools={tools} />}
      </div>
    </ConfigProvider>
  );
};

export default ScreenShot;
