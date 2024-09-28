import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { OptionArrow, OptionCircle, OptionLine, OptionRect } from './option';
import { ToolSimpleList } from '../config';
import { ToolIconList } from '../icon';
import { OptionPencil } from '@/screenshot/components/option/OptionPencil.tsx';
import { OptionText } from '@/screenshot/components/option/OptionText.tsx';

export interface ShotToolsContainerProps {
  rect: IToolRectType;
  tools: IToolType[];
  action?: IToolActionType;
  onSelect: (item: IToolActionType) => void;
  onUpdate: (options: IToolActionType) => void;
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = ({
  rect,
  tools,
  action,
  onSelect,
  onUpdate
}) => {
  const onOptionsUpdate = (tool: IToolType, options: IShapeOption) => {
    onUpdate({ type: tool.type, options: options });
  };

  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[20] h-10 gap-1 px-2 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm'
      style={{ left: `${rect.x}px`, top: `${rect.y}px` }}
    >
      {tools.map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover key={tool.type} open={action?.type === tool.type}>
            <TooltipProvider>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div
                      key={tool.type}
                      className={cn(
                        'w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20',
                        action?.type === tool.type
                          ? 'bg-black bg-opacity-20'
                          : ''
                      )}
                      onClick={() => {
                        onSelect?.({
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
              side={rect.position}
              sideOffset={8}
              align='start'
              className='bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm p-2  w-auto'
            >
              {tool.type === 'Rect' && (
                <OptionRect
                  options={tool.options}
                  defaultOptions={tool.options}
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
              {tool.type === 'Pencil' && (
                <OptionPencil
                  options={tool.options}
                  onUpdateOptions={(_options) =>
                    onOptionsUpdate(tool, _options)
                  }
                />
              )}
              {tool.type === 'Text' && (
                <OptionText
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
              onSelect({ type: tool.type });
            }}
          >
            <Icon className='w-4 h-4' />
          </div>
        );
      })}
    </div>
  );
};
