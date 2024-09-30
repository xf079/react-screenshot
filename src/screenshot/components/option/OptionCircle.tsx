import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Slider, Checkbox, Divider } from 'antd';
import { Check } from 'lucide-react';
import { circleDefaultOptions, ToolColorList } from '../../config';

export const OptionCircle: FC<IOptionCommonProps> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: circleDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='w-[320px] flex flex-row items-center gap-1'>
      <div className='flex flex-col gap-1.5'>
        <div className='flex flex-row justify-end items-center gap-3'>
          <span className='w-12 text-right text-xs font-medium text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            min={5}
            max={25}
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
            className='w-[44px] m-0'
            onChange={(value) => {
              updateState({ ...state, opacity: value });
            }}
          />
          <span className='w-6 text-xs font-medium text-stone-900 text-opacity-90'>
            {state.opacity || 0}
          </span>
        </div>
      </div>
      <Divider type="vertical" dashed className='h-8'/>
      <div className='flex flex-row flex-shrink-0 justify-center items-center flex-wrap gap-2 w-[80px] pt-0.5'>
        {ToolColorList.map((val) => (
          <a
            key={val}
            className='inline-flex w-3.5 h-3.5 rounded-sm justify-center items-center cursor-pointer'
            onClick={() => {
              updateState({ ...state, color: val });
            }}
            style={{ backgroundColor: val }}
          >
            {state.color === val && <Check className='w-3 h-3 text-white' />}
          </a>
        ))}
      </div>
      <Divider type="vertical" dashed className='h-8'/>
      <div className='h-full flex-shrink-0 flex self-start'>
        <Checkbox
          checked={state.full}
          onChange={(e) => {
            updateState({ ...state, full: e.target.checked });
          }}
        >
          <span className='text-xs font-medium text-stone-900 text-opacity-90'>
            实心
          </span>
        </Checkbox>
      </div>
    </div>
  );
});
