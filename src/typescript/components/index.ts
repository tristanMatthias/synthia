import './App/App';
import './Root/Root';
import './Oscillator/Oscillator';
import './Filter/Filter';
import './Canvas/Canvas';
import './Waveform/Waveform';
import './CircleMenu/CircleMenu';
import './Button/Button';
import './Slider/Slider';
import './ExpoSlider/ExpoSlider';
import { SElement } from '../types';


(() => {
  const app = document.querySelector(SElement.app)!;
  const mainWaveform = document.querySelector(SElement.waveform)!;
  mainWaveform.connect(app.context.destination);
})();
