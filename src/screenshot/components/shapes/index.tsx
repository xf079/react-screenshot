import { Group } from 'react-konva';
import { ShapeRect } from './ShapeRect';
import { ShapeArrow } from './ShapeArrow';
import { ShapeCircle } from './ShapeCircle';
import { ShapeLine } from './ShapeLine';
import { ShapePencil } from './ShapePencil';
import { ShapeMosaic } from './ShapeMosaic';

export interface ShapesProps extends ShapeBaseProps {
  list: IShapeType[];
  image: HTMLImageElement;
  width: number;
  height: number;
}

export const Shapes = ({
  list,
  shot,
  selected,
  mode,
  image,
  updateSelected,
  updateMode,
  onUpdateShapeState
}: ShapesProps) => {
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
        if (item.type === 'Mosaic') {
          return (
            <ShapeMosaic
              key={index}
              shape={item}
              shot={shot}
              mode={mode}
              image={image}
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
};
