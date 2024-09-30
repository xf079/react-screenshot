import { memo } from 'react';
import { Input, Slider, Checkbox } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '../store';

export const ShotSizeContainer = memo(() => {
  const {
    shot,
    windowWidth,
    windowHeight,
    width,
    height,
    sizedRect,
    shadow,
    radius,
    updateShot,
    updateRadius,
    updateShadow
  } = useStore(
    useShallow((state) => ({
      shot: state.shot,
      windowWidth: state.width,
      windowHeight: state.height,
      width: (state.shot?.width || 0).toFixed(0),
      height: (state.shot?.height || 0).toFixed(0),
      sizedRect: state.sizedRect,
      shadow: state.shadow,
      radius: state.radius,
      updateShot: state.updateShot,
      updateShadow: state.updateShadow,
      updateRadius: state.updateRadius
    }))
  );
  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[100] h-8 gap-2 px-2 bg-white rounded-sm'
      style={{ top: sizedRect.y, left: sizedRect.x }}
    >
      <div className='flex flex-row justify-start gap-2 text-black font-light text-sm'>
        <Input
          className='w-14 h-5 text-xs text-center font-medium'
          value={width}
          onChange={(e) => {
            if (!shot) return;
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newWidth =
                sizedRect.x + value < windowWidth
                  ? value
                  : windowWidth - sizedRect.x;
              updateShot({ ...shot, width: newWidth });
            } else {
              updateShot(shot);
            }
          }}
        />
        <span className='font-medium'>x</span>
        <Input
          className='w-14 h-5 text-xs text-center font-medium'
          value={height}
          onChange={(e) => {
            if (!shot) return;
            const value = Number(e.target.value);
            if (/^\d+$/.test(e.target.value)) {
              const newHeight =
                sizedRect.y + value < windowHeight
                  ? value
                  : windowHeight - sizedRect.y;
              updateShot({ ...shot, height: newHeight });
            } else {
              updateShot(shot);
            }
          }}
        />
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={radius}
        className='w-[60px]'
        onChange={(value) => {
          updateRadius(value);
        }}
      />
      <div className='flex items-center space-x-2 cursor-pointer'>
        <Checkbox
          checked={shadow}
          onChange={(e) => {
            updateShadow(e.target.checked);
          }}
        >
          <span className='text-xs font-medium'>阴影</span>
        </Checkbox>
      </div>
    </div>
  );
});
