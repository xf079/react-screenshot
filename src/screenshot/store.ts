import { create } from 'zustand';
import {
  TOOLBAR_HEIGHT,
  TOOLBAR_MODAL_HEIGHT,
  TOOLBAR_SPLIT,
  TOOLBAR_WIDTH
} from './constants';

export interface IStore {
  width: number;
  height: number;
  shot?: IShotRect;
  action?: IToolActionType;
  mode?: IModeType;
  list: IShapeType[];
  selected?: string;
  radius: number;
  shadow: boolean;

  shape?: IShapeType;
  sizedRect: IPosition;
  toolRect: IToolPosition;

  init: (width: number, height: number) => void;

  updateShot: (shot?: IShotRect) => void;
  addShape: (shape: IShapeType) => void;
  updateShape: (shape: IShapeType) => void;
  updateMode: (mode?: IModeType) => void;
  updateSelected: (id?: string) => void;
  updateAction: (action: IToolActionType) => void;
  updateRadius: (radius: number) => void;
  updateShadow: (shadow: boolean) => void;
}

export const useStore = create<IStore>((set, get) => ({
  width: 0,
  height: 0,
  shot: undefined,
  action: undefined,
  list: [],
  mode: undefined,
  selected: undefined,
  radius: 0,
  shadow: false,

  get shape() {
    return get().list.find((item) => item.id === get().selected);
  },

  get sizedRect() {
    const shot = get().shot;
    const width = get().width;
    if (!shot) return { x: 0, y: 0 };
    const { x: shotX = 0, y: shotY = 0, width: shotW = 0 } = shot;
    const y = shotY > 38 ? shotY - 38 : shotY + 10;
    const x =
      shotW > 444 ? shotX + 6 : width - shotX > 444 ? shotX + 6 : width - 444;
    return { x, y };
  },

  get toolRect() {
    const shot = get().shot;
    const height = get().height;
    if (!shot) return { x: 0, y: 0, position: 'top' };
    const {
      x: shotX = 0,
      y: shotY = 0,
      width: shotW = 0,
      height: shotH = 0
    } = shot;

    const pendY = shotY + shotH;
    const pendX = shotX + shotW;

    const y =
      pendY + TOOLBAR_HEIGHT + TOOLBAR_SPLIT < height
        ? pendY + TOOLBAR_SPLIT
        : pendY - (TOOLBAR_HEIGHT + TOOLBAR_SPLIT);

    const x =
      pendX > TOOLBAR_WIDTH + TOOLBAR_SPLIT
        ? pendX - (TOOLBAR_WIDTH + TOOLBAR_SPLIT / 2)
        : shotX + TOOLBAR_SPLIT / 2;

    const position =
      pendY + TOOLBAR_HEIGHT + TOOLBAR_SPLIT + TOOLBAR_MODAL_HEIGHT < height
        ? 'bottom'
        : 'top';

    return { x, y, position };
  },

  init: (width, height) => {
    set({ width, height });
  },

  updateShot: (shot) => {
    console.log(shot);
    set({ shot });
  },
  addShape: (shape) => {
    set({ list: [...get().list, shape] });
  },
  updateShape: (shape) => {
    set({
      list: get().list.map((item) => (item.id === shape.id ? shape : item))
    });
  },
  updateMode: (mode) => {
    set({ mode });
  },
  updateSelected: (id) => {
    const { list } = get();
    const current = list.find((item) => item.id === id);
    if (current) {
      set({
        action: {
          type: current.type,
          options: current.options
        }
      });
    }
    set({ selected: id });
  },
  updateAction: (action) => {
    set({ action });
  },
  updateRadius: (radius) => {
    set({ radius });
  },
  updateShadow: (shadow) => {
    set({ shadow });
  }
}));
