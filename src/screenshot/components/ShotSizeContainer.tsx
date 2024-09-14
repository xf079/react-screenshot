import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export interface ShotSizeContainerProps {
  windowWidth: number;
  windowHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  radius: number;
  shadow: boolean;
  onRectChange: (width: number, height: number) => void;
  onRadiusChange: (radius: number) => void;
  onShadowChange: (shadowEnabled: boolean) => void;
}

export const ShotSizeContainer: FC<ShotSizeContainerProps> = ({
  windowWidth,
  windowHeight,
  width,
  height,
  x,
  y,
  radius,
  shadow,
  onRectChange,
  onRadiusChange,
  onShadowChange
}) => {
  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[9999] h-7 gap-3 px-3 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm'
      style={{ top: y, left: x }}
    >
      <div className='flex flex-row justify-start gap-2 text-black font-light text-sm'>
        <Input
          placeholder='Filled'
          className='w-14 h-5 text-xs text-center'
          value={width}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newWidth =
                x + value < windowWidth ? value : windowWidth - x;
              onRectChange(newWidth, height);
            } else {
              onRectChange(width, height);
            }
          }}
        />
        <span>x</span>
        <Input
          placeholder='Filled'
          className='w-14 h-5 text-xs text-center'
          value={height}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newHeight =
                y + value < windowHeight ? value : windowHeight - y;
              onRectChange(width, newHeight);
            } else {
              onRectChange(width, height);
            }
          }}
        />
      </div>
      <Slider
        defaultValue={[radius]}
        min={0}
        max={100}
        step={1}
        value={[radius]}
        className='w-[60px]'
        onValueChange={(values) => {
          onRadiusChange(values[0]);
        }}
      />
      <div
        className='flex items-center space-x-2 cursor-pointer'
        onClick={() => {
          onShadowChange(!shadow);
        }}
      >
        <Checkbox checked={shadow} />
        <span className='text-xs font-medium select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          阴影
        </span>
      </div>
    </div>
  );
};
