import { Effect } from 'tone';
import { generateImpulseResponse } from '../generateImpulseResponse';


interface ReverbOptions {
  wetGain?: number,
  dryGain?: number,
  decayTime?: number
  fadeInTime?: number
  roomSize?: number
}


export class SynthiaReverb extends Effect {

  private _decayTime: number;
  get decayTime() { return this._decayTime; }
  set decayTime(v: number) {
    const past = this._decayTime;
    this._decayTime = v;
    if (past !== v) this._getImpulseResponse();
  }

  private _fadeInTime: number;
  get fadeInTime() { return this._fadeInTime; }
  set fadeInTime(v: number) {
    const past = this._fadeInTime;
    this._fadeInTime = v;
    if (past !== v) this._getImpulseResponse();
  }

  private _roomSize: number;
  get roomSize() { return this._roomSize; }
  set roomSize(v: number) {
    const past = this._roomSize;
    this._roomSize = v;
    if (past !== v) this._getImpulseResponse();
  }

  _convolver: Tone.Convolver;


  get buffer() { return this._convolver.buffer; }
  set buffer(b: AudioBuffer | null) { this._convolver.buffer = b!; }


  constructor(
    options?: ReverbOptions
  ) {
    super();

    const settings: ReverbOptions = {
      wetGain: 0.5,
      dryGain: 0.5,
      decayTime: 3,
      fadeInTime: 0.1,
      roomSize: 150000,
      ...options,
    };

    this._decayTime = settings.decayTime!;
    this._fadeInTime = settings.fadeInTime!;
    this._roomSize = settings.roomSize!;

    // @ts-ignore
    this._convolver = this.context.createConvolver();
    this._getImpulseResponse();
    // @ts-ignore
    this.connectEffect(this._convolver);
  }


  async _getImpulseResponse() {
    // @ts-ignore
    this.buffer = await generateImpulseResponse(this.context.rawContext, {
      decayTime: this.decayTime,
      fadeInTime: this.fadeInTime,
      roomSize: this.roomSize,
      lpFreqEnd: 0,
    })
  }
}
