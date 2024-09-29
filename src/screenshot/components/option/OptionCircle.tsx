import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Check } from 'lucide-react';
import { Slider, Checkbox } from 'antd';
import { circleDefaultOptions, ToolColorList } from '../../config';

export interface ICircleOption {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionCircle: FC<ICircleOption> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: circleDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='w-[315px] flex flex-row items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-end items-center gap-3'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            min={5}
            max={15}
            step={5}
            value={state.size}
            className='w-[60px] m-0'
            onChange={(val) => {
              updateState({ ...state, size: val });
            }}
          />
          <span className='w-6  text-xs text-stone-900 text-opacity-90'>
            {state.size || 0}
          </span>
        </div>
        <div className='flex flex-row flex-shrink-0 justify-end items-center gap-3'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            透明度
          </span>
          <Slider
            min={0}
            max={100}
            step={1}
            value={state.opacity}
            className='w-[60px] m-0'
            onChange={(val) => {
              updateState({ ...state, opacity: val });
            }}
          />
          <span className='w-6 text-xs text-stone-900 text-opacity-90'>
            {state.opacity || 0}
          </span>
        </div>
      </div>
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
      <div className='h-full flex flex-col justify-center self-start items-start gap-2 pt-0.5 ml-2'>
        <div
          className='flex flex-rwo justify-start items-center gap-1.5 cursor-pointer'
          onClick={() => {
            updateState({ ...state, full: !state.full });
          }}
        >
          <Checkbox checked={state.full} />
          <span className='flex-shrink-0 text-xs text-stone-900 text-opacity-90'>
            空心
          </span>
        </div>
      </div>
    </div>
  );
});
