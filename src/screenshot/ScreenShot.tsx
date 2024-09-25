import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import Konva from 'konva';
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

  const [tools, updateTools] = useState<IToolType[]>(ToolList);

  // 是否开始绘制截图区域
  const isDrawing = useRef(false);

  /**
   * 截图区域数据
   */
  const [shot, updateShot] = useState<IShotRect>();

  /**
   * 图形列表
   */
  const [list, updateList] = useState<IShapeType[]>([]);

  /**
   * 当前操作模式
   */
  const [mode, updateMode] = useState<IModeType>();

  /**
   * 当前工具
   */
  const [action, updateAction] = useState<IToolActionType>();

  /**
   * 当前绘制的图形
   */
  const [shape, updateShape] = useState<IShapeType>();

  /**
   * 当前选中的图形的id
   */
  const [selected, updateSelected] = useState<string>();

  /**
   * 区域圆角
   */
  const [radius, setRadius] = useState(10);
  /**
   * 是否显示阴影
   */
  const [shadow, setShadow] = useState(false);

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
    isDrawing,
    shot,
    mode,
    updateShot,
    updateMode
  });
  const {
    onShapeMouseDownHandler,
    onShapeMouseMoveHandler,
    onShapeMouseUpHandler
  } = useMouseShapeHandler({
    isDrawing,
    shot,
    mode,
    action,
    shape,
    updateMode,
    updateSelected,
    updateShape,
    updateList
  });

  const sizeRect = useMemo(() => {
    if (!shot) return { x: 0, y: 0 };
    const { x: shotX = 0, y: shotY = 0, width: shotW = 0 } = shot;
    const y = shotY > 34 ? shotY - 34 : shotY + 10;
    const x =
      shotW > 444 ? shotX + 6 : width - shotX > 444 ? shotX + 6 : width - 444;
    return { x, y };
  }, [shot, width]);

  const toolsRect = useMemo<IToolRectType>(() => {
    if (!shot) return { x: 0, y: 0, position: 'top' };
    const {
      x: shotX = 0,
      y: shotY = 0,
      width: shotW = 0,
      height: shotH = 0
    } = shot;

    const pendY = shotY + shotH;
    const pendX = shotX + shotW;

    const y =
      pendY + SHOT_TOOLBAR_HEIGHT + SHOT_TOOLBAR_SPLIT < height
        ? pendY + SHOT_TOOLBAR_SPLIT
        : pendY - (SHOT_TOOLBAR_HEIGHT + SHOT_TOOLBAR_SPLIT);

    const x =
      pendX > SHOT_TOOLBAR_WIDTH + SHOT_TOOLBAR_SPLIT
        ? pendX - (SHOT_TOOLBAR_WIDTH + SHOT_TOOLBAR_SPLIT / 2)
        : shotX + SHOT_TOOLBAR_SPLIT / 2;

    const position =
      pendY +
        SHOT_TOOLBAR_HEIGHT +
        SHOT_TOOLBAR_SPLIT +
        SHOT_TOOLBAR_MODAL_HEIGHT <
      height
        ? 'bottom'
        : 'top';

    return { x, y, position };
  }, [height, shot]);

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
      console.log(imageData);
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

  const onUpdateActionOptions = useMemoizedFn((tool: IToolActionType) => {
    const _tools = tools.map((item) => {
      return item.type === tool.type
        ? { ...item, options: tool.options }
        : item;
    });
    updateTools(_tools);
    updateAction(tool);
    const _idx = list.findIndex((item) => item.id === selected);
    if (_idx !== -1) {
      const _list = list.map((item) => {
        if (item.id === selected && item.type === tool.type) {
          return { ...item, options: tool.options };
        }
        return item;
      });
      updateList(_list);
    }
  });

  const onUpdateShapeStateHandler = useMemoizedFn((shape: IShapeType) => {
    const _list = list.map((item) => (item.id === shape.id ? shape : item));
    updateList(_list);
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
    };
  }, [image]);

  return (
    <div id='screenshot' style={{ position: 'relative' }}>
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
        onContextMenu={() => {}}
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
          {shot && (
            <Shapes
              list={shapes}
              shot={shot}
              mode={mode}
              image={source.current}
              selected={selected}
              updateMode={updateMode}
              updateSelected={updateSelected}
              onUpdateShapeState={onUpdateShapeStateHandler}
            />
          )}
        </Layer>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            listening={!shot}
            fill='rgba(0,0,0,0.5)'
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
      {!isDragMove && shot && (
        <Fragment>
          <ShotSizeContainer
            windowWidth={width}
            windowHeight={height}
            width={shot.width || 0}
            height={shot.height || 0}
            x={sizeRect.x}
            y={sizeRect.y}
            radius={radius}
            shadow={shadow}
            onRectChange={(_w, _h) => {
              updateShot({ ...shot, width: _w, height: _h });
            }}
            onRadiusChange={setRadius}
            onShadowChange={setShadow}
          />
          <ShotToolsContainer
            rect={toolsRect}
            tools={tools}
            action={action}
            onSelect={onSelectActon}
            onUpdate={onUpdateActionOptions}
          />
        </Fragment>
      )}
    </div>
  );
};

export default ScreenShot;
