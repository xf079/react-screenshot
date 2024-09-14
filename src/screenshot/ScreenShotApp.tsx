import { FC } from 'react';
import { ShotProvider } from './Context';
import ScreenShot, { ScreenShotProps } from './ScreenShot';

const ScreenShotApp: FC<ScreenShotProps> = (props) => (
  <ShotProvider>
      <ScreenShot {...props} />
  </ShotProvider>
);

export default ScreenShotApp;
