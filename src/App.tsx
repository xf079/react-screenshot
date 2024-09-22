import { ScreenShot } from './screenshot';
import BgImage from './assets/bg.jpg';
import { useState } from 'react';
const App = () => {
  const [url, setUrl] = useState('');
  return (
    <>
      <ScreenShot
        image={BgImage}
        width={window.innerWidth}
        height={window.innerHeight}
        onSuccess={(data) => {
          setUrl(data);
        }}
      />
      <img src={url} alt='' />
    </>
  );
};

export default App;
