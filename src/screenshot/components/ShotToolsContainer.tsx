import { FC, memo } from 'react';

import {
  OptionArrow,
  OptionCircle,
  OptionLine,
  OptionRect,
  OptionPencil,
  OptionMosaic,
  OptionText
} from './option';
import { Popover, Tooltip } from 'antd';
import { clsx } from 'clsx';
import { ToolSimpleList } from '../config';
import { ToolIconList } from '../icon';
import { useStore } from '@/screenshot/store.ts';

export interface ShotToolsContainerProps {
  tools: IToolType[];
}

export const ShotToolsContainer: FC<ShotToolsContainerProps> = memo(({ tools }) => {
  const { toolRect, action, updateAction } = useStore();

  const onOptionsUpdate = (tool: IToolType, options: IShapeOption) => {
    // onUpdate({ type: tool.type, options: options });
  };

  const renderToolOptionContent = (tool: IToolType) => {
    if (tool.type === 'Rect') {
      return (
        <OptionRect
          options={tool.options}
          defaultOptions={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Circle') {
      return (
        <OptionCircle
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Line') {
      return (
        <OptionLine
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Arrow') {
      return (
        <OptionArrow
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Pencil') {
      return (
        <OptionPencil
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Mosaic') {
      return (
        <OptionMosaic
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    if (tool.type === 'Text') {
      return (
        <OptionText
          options={tool.options}
          onUpdateOptions={(_options) => onOptionsUpdate(tool, _options)}
        />
      );
    }
    return <></>;
  };

  return (
    <div
      className='flex flex-row justify-start items-center absolute z-[20] h-10 gap-1 px-2 bg-white rounded-sm'
      style={{ left: `${toolRect.x}px`, top: `${toolRect.y}px` }}
    >
      {tools.map((tool) => {
        const Icon = ToolIconList[tool.type];
        return (
          <Popover
            key={tool.type}
            placement={`${toolRect.position}Left`}
            content={renderToolOptionContent(tool)}
            open={action?.type === tool.type}
            trigger='click'
          >
            <Tooltip title={tool.title}>
              <div
                key={tool.type}
                className={clsx(
                  'w-8 h-8 flex flex-row justify-center items-center cursor-pointer transition-all duration-200 rounded-sm hover:bg-black hover:bg-opacity-20',
                  action?.type === tool.type ? 'bg-black bg-opacity-20' : ''
                )}
                onClick={() => {
                  updateAction({
                    type: tool.type,
                    options: tool.options
                  });
                }}
              >
                <Icon className='w-4 h-4' />
              </div>
            </Tooltip>
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
              updateAction({ type: tool.type });
            }}
          >
            <Icon className='w-4 h-4' />
          </div>
        );
      })}
    </div>
  );
});
