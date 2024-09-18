import { Group } from 'react-konva';
import { ShapeRect } from './ShapeRect.tsx';
import { ShapeArrow } from './ShapeArrow.tsx';
import { memo } from 'react';

export interface ShapesProps {
  list: IShapeType[];
  selected?: string;
  onSelected: (id: string) => void;
}

export const Shapes = memo(({ list, selected, onSelected }: ShapesProps) => {
  return (
    <Group>
      {list.map((item, index) => {
        if (item.type === 'Rect') {
          return (
            <ShapeRect
              shape={item}
              key={index}
              selected={selected}
              onSelected={onSelected}
            />
          );
        }

        if (item.type === 'Arrow') {
          return <ShapeArrow shape={item} key={index} />;
        }
        return null;
      })}
    </Group>
  );
});
