import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage, Transformer } from 'react-konva';
import { useMemoizedFn } from 'ahooks';
import Konva from 'konva';

import { useMouseShotHandler } from './hooks/useMouseShotHandler';
import { useMouseShapeHandler } from './hooks/useMouseShapeHandler';
import { useMousePreviewColor } from './hooks/useMousePreviewColor';
import { useShotBoundHandler } from './hooks/useShotBoundHandler';
import { ShotMousePreviewRect } from './components/ShotMousePreviewRect';
import { ShotSizeContainer } from './components/ShotSizeContainer';
import { ShotToolsContainer } from './components/ShotToolsContainer';
import { Shapes } from './components/shapes';
import {
  SHOT_TOOLBAR_HEIGHT,
  SHOT_TOOLBAR_MODAL_HEIGHT,
  SHOT_TOOLBAR_SPLIT,
  SHOT_TOOLBAR_WIDTH
} from './constants';
import { ToolList } from '@/screenshot/config';

export interface ScreenShotProps {
  image: string;
  width: number;
  height: number;
}

const ScreenShot: FC<ScreenShotProps> = ({ image, width, height }) => {
  const source = useRef(new window.Image());
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
   * 添加图形的最大索引
   */
  const [index, updateIndex] = useState(1);

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
    index,
    action,
    shape,
    updateMode,
    updateIndex,
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

  const shapes = useMemo(() => {
    return (shape ? [...list, shape] : list).sort((a, b) => a.index - b.index);
  }, [list, shape]);

  const onSelectActon = useMemoizedFn((tool: IToolActionType) => {
    if (tool.options) {
      updateAction(tool);
    } else {
      // updateAction(tool);
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
        if (item.id === selected) {
          return { ...item, options: tool.options };
        }
        return item;
      });
      updateList(_list);
    }
  });

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
          if (mode === 'shot') {
            onShotMouseMoveHandler(e);
          } else if (mode === 'shape') {
            onShapeMouseMoveHandler(e);
          } else {
            onMouseColorMoveHandler(e);
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
        </Layer>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            listening={false}
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
          {shot && (
            <Shapes
              list={shapes}
              shot={shot}
              selected={selected}
              onSelected={updateSelected}
            />
          )}
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
