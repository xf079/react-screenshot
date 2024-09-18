import { FC, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
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
import { OptionRect, OptionCircle, OptionLine, OptionArrow } from './option';
import { ToolList, ToolSimpleList } from '../config';
import { ToolIconList } from '../icon';

export interface ShotToolsContainerProps {
  x: number;
  y: number;
  position: 'top' | 'bottom';
  action?: IToolActionType;
  onSelect: (item: IToolActionType) => void;
  onUpdate: (options: IToolActionType) => void;
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const [tools, updateTools] = useState(ToolList);
  
  const onOptionsUpdate = useMemoizedFn(
    (tool: IToolType, options: IShapeOption) => {
      updateTools((prevState) => {
        const updatedTools = prevState.map((t) => {
          if (t.type === tool.type) {
            return { ...t, options: { ...t.options, ...options } };
          }
          return t;
        });
        return updatedTools;
      });
      if (props.action) {
        props.onUpdate({ type: tool.type, options: options });
      }
    }
  );

  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[99] h-10 gap-1 px-2 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {tools.map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover key={tool.type} open={props.action?.type === tool.type}>
            <TooltipProvider>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div
                      key={tool.type}
                      className={cn(
                        'w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20',
                        props.action?.type === tool.type
                          ? 'bg-black bg-opacity-20'
                          : ''
                      )}
                      onClick={() => {
                        props.onSelect?.({
                          type: tool.type,
                          options: tool.options
                        });
                      }}
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
              className='bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm p-2  w-auto'
            >
              {tool.type === 'Rect' && (
                <OptionRect
                  options={tool.options}
                  onUpdateOptions={(_options) =>
                    onOptionsUpdate(tool, _options)
                  }
                />
              )}
              {tool.type === 'Circle' && (
                <OptionCircle
                  options={tool.options}
                  onUpdateOptions={(_options) =>
                    onOptionsUpdate(tool, _options)
                  }
                />
              )}
              {tool.type === 'Line' && (
                <OptionLine
                  options={tool.options}
                  onUpdateOptions={(_options) =>
                    onOptionsUpdate(tool, _options)
                  }
                />
              )}
              {tool.type === 'Arrow' && (
                <OptionArrow
                  options={tool.options}
                  onUpdateOptions={(_options) =>
                    onOptionsUpdate(tool, _options)
                  }
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
            onClick={() => {
              props.onSelect({ type: tool.type });
            }}
          >
            <Icon className='w-4 h-4' />
          </div>
        );
      })}
    </div>
  );
};
