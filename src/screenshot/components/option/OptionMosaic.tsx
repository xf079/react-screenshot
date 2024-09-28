import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
import { Slider } from '@/components/ui/slider';
import { pencilDefaultOptions, ToolColorList } from '../../config';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Check } from 'lucide-react';

export interface IPencilOption {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionPencil: FC<IPencilOption> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: pencilDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  // @ts-ignore
  return (
    <div className='w-[375px] flex flex-row items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-end items-center gap-2'>
          <span className='w-9 text-right text-xs text-stone-900 text-opacity-90'>
            大小
          </span>
          <Slider
            defaultValue={[state.size || 0]}
            min={10}
            max={60}
            step={5}
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
            disabled
            value={[state.opacity || 0]}
            className='w-[60px] opacity-40'
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
      <div className='h-full flex flex-col justify-center self-start items-start gap-2 pt-0.5 ml-2'>
        <Select
          defaultValue={state.pencilMode}
          onValueChange={(val) => {
            updateState({ ...state, pencilMode: val as unknown as IShapeOption['pencilMode'] });
          }}
        >
          <SelectTrigger className='w-[100px]'>
            <SelectValue placeholder='请选择操作类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='Color'>单一颜色</SelectItem>
              <SelectItem value='GaussianBlur'>高斯模糊</SelectItem>
              <SelectItem value='Mosaic'>马赛克</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});
