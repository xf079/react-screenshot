import { FC, memo } from 'react';
import { useControllableValue } from 'ahooks';
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

export interface IOptionText {
  options?: IShapeOption;
  defaultOptions?: IShapeOption;
  onUpdateOptions: (options: IShapeOption) => void;
}

export const OptionText: FC<IOptionText> = memo((props) => {
  const [state, updateState] = useControllableValue(props, {
    defaultValue: pencilDefaultOptions,
    defaultValuePropName: 'defaultOptions',
    valuePropName: 'options',
    trigger: 'onUpdateOptions'
  });

  const fontSize = Array(8)
    .fill(0)
    .map((_, i) => String(i + 10));
  console.log(fontSize);

  return (
    <div className='w-[375px] flex flex-row items-center gap-3'>
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
            updateState({
              ...state,
              pencilMode: val as unknown as IShapeOption['pencilMode']
            });
          }}
        >
          <SelectTrigger className='w-[100px]'>
            <SelectValue placeholder='请选择操作类型' />
          </SelectTrigger>
          <SelectContent className='w-[100px]'>
            <SelectGroup>
              {fontSize.map((val) => (
                <SelectItem value={val}>{val}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          defaultValue={state.pencilMode}
          onValueChange={(val) => {
            updateState({
              ...state,
              pencilMode: val as unknown as IShapeOption['pencilMode']
            });
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
