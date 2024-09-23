import { memo } from 'react';
import { Group } from 'react-konva';
import { ShapeRect } from './ShapeRect.tsx';
import { ShapeArrow } from './ShapeArrow.tsx';
import { ShapeCircle } from './ShapeCircle.tsx';
import { ShapeLine } from './ShapeLine.tsx';
import { ShapePencil } from '@/screenshot/components/shapes/ShapePencil.tsx';

export interface ShapesProps extends ShapeBaseProps {
  list: IShapeType[];
}

export const Shapes = memo(
  ({
    list,
    shot,
    selected,
    mode,
    updateSelected,
    updateMode,
    onUpdateShapeState
  }: ShapesProps) => {
    console.log(list);
    return (
      <Group>
        {list.map((item, index) => {
          if (item.type === 'Rect') {
            return (
              <ShapeRect
                key={index}
                shape={item}
                shot={shot}
                mode={mode}
                selected={selected}
                updateSelected={updateSelected}
                updateMode={updateMode}
                onUpdateShapeState={onUpdateShapeState}
              />
            );
          }
          if (item.type === 'Circle') {
            return (
              <ShapeCircle
                key={index}
                shape={item}
                shot={shot}
                mode={mode}
                selected={selected}
                updateSelected={updateSelected}
                updateMode={updateMode}
                onUpdateShapeState={onUpdateShapeState}
              />
            );
          }
          if (item.type === 'Line') {
            return (
              <ShapeLine
                key={index}
                shape={item}
                shot={shot}
                mode={mode}
                selected={selected}
                updateSelected={updateSelected}
                updateMode={updateMode}
                onUpdateShapeState={onUpdateShapeState}
              />
            );
          }

          if (item.type === 'Arrow') {
            return (
              <ShapeArrow
                key={index}
                shape={item}
                shot={shot}
                mode={mode}
                selected={selected}
                updateSelected={updateSelected}
                updateMode={updateMode}
                onUpdateShapeState={onUpdateShapeState}
              />
            );
          }
          if (item.type === 'Pencil') {
            return (
              <ShapePencil
                key={index}
                shape={item}
                shot={shot}
                mode={mode}
                selected={selected}
                updateSelected={updateSelected}
                updateMode={updateMode}
                onUpdateShapeState={onUpdateShapeState}
              />
            );
          }
          return null;
        })}
      </Group>
    );
  }
);
