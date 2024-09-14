import { ScreenShot } from './screenshot';
import BgImage from './assets/bg.jpg';
const App = () => {
    return (
        <ScreenShot
            image={BgImage}
            width={window.innerWidth}
            height={window.innerHeight}
            primaryColor='#1677ff'
        />
    );
};

export default App;
