import { FC, useContext } from 'react';
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
import { ShotContext } from '@/screenshot/Context';
import { OptionRect, OptionCircle, OptionLine, OptionArrow } from './option';
import { ToolList, ToolSimpleList } from '../config';
import { ToolIconList } from '../icon';

export interface ShotToolsContainerProps {
  x: number;
  y: number;
  position: 'top' | 'bottom';
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = (props) => {
  const { state, dispatch } = useContext(ShotContext);
  const [tools, updateTools] = useLocalStorageState('local-tools', {
    defaultValue: ToolList.map((item) => ({
      ...item,
      options: Object.assign({}, item.options, {})
    })),
    listenStorageChange: true
  });

  const onItemOptionAction = (item: IToolType) => {
    dispatch({
      type: 'UPDATE_ACTION',
      payload: {
        type: item.type,
        options: item.options
      }
    });
  };

  const onItemAction = (item: IToolSimpleType) => {
    dispatch({
      type: 'UPDATE_ACTION',
      payload: {
        type: item.type
      }
    });
  };

  const onOptionsUpdate = useMemoizedFn((options: IShapeOption) => {
    if (state.action) {
      dispatch({
        type: 'UPDATE_ACTION',
        payload: {
          ...state.action,
          options
        }
      });
      if (tools) {
        updateTools(
          tools.map((item) => {
            if (item.type === state.action?.type) {
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
      className='flex flex-row justify-start items-center absolute z-[99] h-10 gap-2 px-3 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm'
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      {(tools || []).map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover key={tool.type} open={state.action?.type === tool.type}>
            <TooltipProvider>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div
                      key={tool.type}
                      className={cn(
                        'w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20',
                        state.action?.type === tool.type
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
              className='bg-white bg-opacity-75 backdrop-filter backdrop-blur-md rounded-sm p-2  w-auto'
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
              {tool.type === 'Line' && (
                <OptionLine
                  options={tool.options}
                  onUpdateOptions={onOptionsUpdate}
                />
              )}
              {tool.type === 'Arrow' && (
                <OptionArrow
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
