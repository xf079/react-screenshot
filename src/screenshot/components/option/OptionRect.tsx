import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { circleDefaultOptions, ToolColorList } from '../../config';

export interface IRectOptions {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionRect: FC<IRectOptions> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: circleDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='w-[315px] flex flex-row items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-end items-center gap-2'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            defaultValue={[state.size || 0]}
            min={1}
            max={100}
            step={1}
            value={[state.size || 0]}
            className='w-[60px]'
            onValueChange={(values) => {
              updateState({ ...state, size: values[0] });
            }}
          />
          <span className='w-6  text-xs text-stone-900 text-opacity-90'>
            {state.size || 0}
          </span>
        </div>
        <div className='flex flex-row flex-shrink-0  justify-end items-center gap-2'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            透明度
          </span>
          <Slider
            defaultValue={[state.opacity || 0]}
            min={0}
            max={100}
            step={1}
            value={[state.opacity || 0]}
            className='w-[60px]'
            onValueChange={(values) => {
              updateState({ ...state, opacity: values[0] });
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
      <div className='h-full flex flex-col justify-center items-start gap-2 pt-0.5 ml-2'>
        <div
          className='flex flex-rwo justify-start items-center gap-1.5 cursor-pointer'
          onClick={() => {
            updateState({ ...state, full: !state.full });
          }}
        >
          <Checkbox checked={state.full} />
          <span className='flex-shrink-0 text-xs text-stone-900 text-opacity-90'>
            实心
          </span>
        </div>
        <div
          className='flex flex-rwo justify-start items-center gap-1.5 cursor-pointer'
          onClick={() => {
            updateState({ ...state, radius: !state.radius });
          }}
        >
          <Checkbox checked={state.radius} />
          <span className='flex-shrink-0 text-xs text-stone-900 text-opacity-90'>
            圆角
          </span>
        </div>
      </div>
    </div>
  );
});
