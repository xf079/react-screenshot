import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useReducer
} from 'react';

type IShotContext = {
  /**
   * 当前模式
   */
  mode?: 'shot' | 'shape' | 'drag';
  /**
   * 截图区域
   */
  shot?: IShotRect;
  /**
   * 当前操作的图形
   */
  action?: ISelectToolOptionType;
  /**
   * 当前操作的图形id
   */
  id?: string;
  /**
   * 当前操作的图形索引
   */
  index: number;
  /**
   * 当前操作的图形列表
   */
  list: IShapeType[];
};

type IAction = {
  type: string;
  payload: any;
};

const initialState: IShotContext = {
  mode: undefined,
  shot: undefined,
  action: undefined,
  id: undefined,
  index: 1,
  list: []
};

const ShotContext = createContext<{
  state: IShotContext;
  dispatch: Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
});

const reducers = (state: IShotContext, action: IAction) => {
  switch (action.type) {
    /**
     * 设置模式
     */
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    /**
     * 设置截图区域
     */
    case 'SET_SHOT':
      return { ...state, shot: action.payload };
    /**
     * 设置当前操作的图形
     */
    case 'UPDATE_ACTION':
      return { ...state, action: action.payload };
    /**
     * 设置当前操作的图形id
     */
    case 'UPDATE_ID':
      return { ...state, id: action.payload };
    /**
     * 设置当前操作的图形索引
     */
    case 'UPDATE_INDEX':
      return { ...state, index: action.payload };
    /**
     * 添加图形
     */
    case 'ADD_SHAPE':
      return { ...state, list: [...state.list, action.payload] };
    /**
     * 删除图形
     */
    case 'DELETE_SHAPE':
      return {
        ...state,
        list: state.list.filter((item) => item.id !== action.payload)
      };
    /**
     * 更新图形
     */
    case 'UPDATE_SHAPE':
      return {
        ...state,
        list: state.list.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        })
      };
  }
  return state;
};

const ShotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <ShotContext.Provider value={{ state, dispatch }}>
      {children}
    </ShotContext.Provider>
  );
};

export { ShotContext, ShotProvider };
