import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Check } from 'lucide-react';
import { lineDefaultOptions, ToolColorList } from '../../config';
import { Slider } from 'antd';

export interface IArrowOptions {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionArrow: FC<IArrowOptions> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: lineDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='w-[234px] flex flex-row items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-end items-center gap-3'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            min={5}
            max={15}
            step={5}
            autoFocus={false}
            value={state.size}
            tooltip={{open:false}}
            className='w-[60px] m-0'
            onChange={(val) => {
              updateState({ ...state, size: val });
            }}
          />
          <span className='w-6  text-xs text-stone-900 text-opacity-90'>
            {state.size || 0}
          </span>
        </div>
        <div className='flex flex-row flex-shrink-0  justify-end items-center gap-3'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            透明度
          </span>
          <Slider
            min={0}
            max={100}
            step={1}
            autoFocus={false}
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
    </div>
  );
});
