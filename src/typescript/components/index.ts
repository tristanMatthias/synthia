import './App/App';
import './Root/Root';
import './Oscillator/Oscillator';
import './Filter/Filter';
import './Canvas/Canvas';
import './Waveform/Waveform';
import './FrequencyResponse/FrequencyResponse';
import './CircleMenu/CircleMenu';
import './Button/Button';
import './Slider/Slider';
import './ExpoSlider/ExpoSlider';
import './Footer/Footer';
import './Sidebar/Sidebar';
import './Toaster/Toaster';
import './Delay/Delay';
import './Reverb/Reverb';
import { SElement } from '../types';


(() => {
  const app = document.querySelector(SElement.app)!;
  const mainWaveform = document.querySelector(SElement.waveform)!;
  mainWaveform.connect(app.context.destination);
})();
