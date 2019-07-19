import './Root/Root';
import './Oscillator/Oscillator';
import './Canvas/Canvas';
import './Waveform/Waveform';
import { SElement } from '../types';


(() => {
  const root = document.querySelector(SElement.root)!;
  const mainWaveform = document.querySelector(SElement.waveform)!;
  mainWaveform.connect(root.context.destination);
})();
