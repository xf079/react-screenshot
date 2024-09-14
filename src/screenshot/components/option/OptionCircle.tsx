import { FC, memo } from 'react';
import { ColorPicker } from 'antd';
import { useControllableValue } from 'ahooks';
import { Check } from 'lucide-react';
import { circleDefaultOptions, ToolColorList } from '../../config';
import { Slider } from '@/components/ui/slider.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';

export interface ICircleOptions {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionCircle: FC<ICircleOptions> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: circleDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  return (
    <div className='flex flex-row items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-end items-center gap-2'>
          <span className='text-xs text-stone-900 text-opacity-90'>大小</span>
          <Slider
            defaultValue={[state.size || 0]}
            min={0}
            max={100}
            step={1}
            value={[state.size || 0]}
            className='w-[60px]'
            onValueChange={(values) => {
              updateState({ ...state, size: values[0] });
            }}
          />
        </div>
        <div className='flex flex-row justify-end items-center gap-2'>
          <span className='text-xs text-stone-900 text-opacity-90'>透明度</span>
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
        </div>
      </div>
      <div className='flex flex-row justify-center items-center flex-wrap gap-2 w-[76px]'>
        {ToolColorList.map((val) => (
          <a
            key={val}
            className='inline-flex w-3 h-3 rounded-sm justify-center items-center'
            style={{ backgroundColor: val }}
          />
        ))}
        <ColorPicker
          value={state.color}
          disabledAlpha
          onChange={(value) => {
            updateState({ ...state, color: `#${value.toHex()}` });
          }}
        >
          <a
            className='color-item'
            style={{ backgroundColor: state.color }}
          ></a>
        </ColorPicker>
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <Checkbox
          checked={state.full}
          onChange={(e) => {
            updateState({ ...state, full: e.target.checked });
          }}
        ></Checkbox>
        <span>空心</span>
      </div>
    </div>
  );
});
