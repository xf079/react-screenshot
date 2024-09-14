import { FC, useState } from 'react';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ToolList, ToolSimpleList } from '../config';
import { OptionRect, OptionCircle } from './option';
import { ToolIconList } from '../icon';

export interface ShotToolsContainerProps {
  options?: Record<IOptionActionKey, IShapeOption>;
  x: number;
  y: number;
  position: 'top' | 'bottom';
  onAction: (action: ISelectToolOptionType) => void;
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const [tools, updateTools] = useLocalStorageState('local-tools', {
    defaultValue: ToolList.map((item) => ({
      ...item,
      options: Object.assign({}, item.options, {})
    })),
    listenStorageChange: true
  });
  const [current, setCurrent] = useState<ISelectToolOptionType>();

  const onItemOptionAction = (item: IToolType) => {
    setCurrent({
      type: item.type,
      options: item.options
    });
    props.onAction({
      type: item.type,
      options: item.options
    });
  };

  const onItemAction = (item: IToolSimpleType) => {
    props.onAction({
      type: item.type
    });
  };

  const onOptionsUpdate = useMemoizedFn((options: IShapeOption) => {
    if (current) {
      setCurrent({ ...current, options });
      if (tools) {
        updateTools(
          tools.map((item) => {
            if (item.type === current.type) {
              return {
                ...item,
                options
              };
            }
            return item;
          })
        );
      }
    }
  });

  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[9999] h-10 gap-2 px-3 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {(tools || []).map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover key={tool.type} open={current?.type === tool.type}>
            <TooltipProvider>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div
                      key={tool.type}
                      className={cn(
                        'w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20',
                        current?.type === tool.type
                          ? 'bg-black bg-opacity-20'
                          : ''
                      )}
                      onClick={() => onItemOptionAction(tool)}
                    >
                      <Icon className='w-4 h-4' />
                    </div>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent
                  className='bg-black bg-opacity-60'
                  align='center'
                  sideOffset={6}
                >
                  <p className='text-white text-sm'>{tool.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent
              side={props.position}
              sideOffset={8}
              align='start'
              className='bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm p-2'
            >
              {tool.type === 'Rect' && (
                <OptionRect
                  options={tool.options}
                  onUpdateOptions={onOptionsUpdate}
                />
              )}
              {tool.type === 'Circle' && (
                <OptionCircle
                  options={tool.options}
                  onUpdateOptions={onOptionsUpdate}
                />
              )}
            </PopoverContent>
          </Popover>
        );
      })}
      {ToolSimpleList.map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <div
            key={tool.type}
            className='w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20'
            onClick={() => onItemAction(tool)}
          >
            <Icon className='w-4 h-4' />
          </div>
        );
      })}
    </div>
  );
};
