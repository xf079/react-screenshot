import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Divider, Radio, Slider } from 'antd';
import { mosaicDefaultOptions } from '../../config';

export const OptionMosaic: FC<IOptionCommonProps> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: mosaicDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='w-[254px] flex flex-row items-center gap-1'>
      <div className='flex flex-col gap-1.5'>
        <div className='flex flex-row justify-end items-center gap-3'>
          <span className='w-12 text-right text-xs font-medium text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            min={1}
            max={50}
            value={state.size}
            className='w-[44px] m-0'
            onChange={(value) => {
              updateState({ ...state, size: value });
            }}
          />
          <span className='w-6  text-xs font-medium text-stone-900 text-opacity-90'>
            {state.size || 0}
          </span>
        </div>
        <div className='flex flex-row flex-shrink-0  justify-end items-center gap-3'>
          <span className='w-12 text-right text-xs font-medium text-stone-900 text-opacity-90'>
            不透明度
          </span>
          <Slider
            min={0}
            max={100}
            value={state.opacity}
            disabled
            tooltip={{ open: false }}
            className='w-[44px] m-0'
          />
          <span className='w-6 text-xs font-medium text-stone-900 text-opacity-90'>
            {state.opacity || 0}
          </span>
        </div>
      </div>
      <Divider type="vertical" className='h-10'/>
      <div className='h-full flex-shrink-0 flex self-start ml-2'>
        <Radio.Group
          value={state.pencilMode}
          onChange={(e) => {
            updateState({ ...state, pencilMode: e.target.value });
          }}
        >
          <div className='flex flex-col gap-2'>
            <Radio value='GaussianBlur' className='text-xs font-medium'>高斯模糊</Radio>
            <Radio value='Mosaic' className='text-xs font-medium'>马赛克</Radio>
          </div>
        </Radio.Group>
      </div>
    </div>
  );
});
