export interface SynthiaFile {
  id: string;
  meta: SynthiaFileMetadata

  resources: {
    synths: SynthiaFileResourceSynth[];
  }
}


export interface SynthiaFileMetadata {
  name: string;
  created: Date;
  public: boolean;
  creatorId: string;
}


export interface SynthiaFileResourceSynth {
  id: string;
  meta: SynthiaFileMetadata;
  nodes: SynthiaFileSynthNode[];
}

export enum SynthiaFileSynthNodeType {
  oscillator = 'oscillator',
  wave = 'wave',
  reverb = 'reverb',
  delay = 'delay',
  filter = 'filter',
  pan = 'pan'
}


interface SynthiaFileSynthNodeBase {
  id: string;
  connectedTo: string[],
  receives: string[],
  position: {
    x: number
    y: number
  }
}

export type SynthiaFileSynthNode =
  SynthiaFileSynthNodeOscillator |
  SynthiaFileSynthNodeWave |
  SynthiaFileSynthNodeReverb |
  SynthiaFileSynthNodeDelay |
  SynthiaFileSynthNodeFilter |
  SynthiaFileSynthNodePan

export interface SynthiaFileSynthNodeOscillator extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.oscillator,
  properties: Partial<{}>
}
export interface SynthiaFileSynthNodeWave extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.wave,
  properties: {
    type: OscillatorType
    delay: number
    attack: number
    attackLevel: number
    decay: number
    decayLevel: number
    release: number
    pitch: number
    gain: number
  }
}
export interface SynthiaFileSynthNodeReverb extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.reverb,
  properties: {
    roomSize: number;
    decayTime: number;
    fadeInTime: number;
    dryWet: number;
  }
}
export interface SynthiaFileSynthNodeDelay extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.delay,
  properties: {
    delayTime: number;
    feedback: number;
    dryWet: number;
  }
}
export interface SynthiaFileSynthNodeFilter extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.filter,
  properties: {
    type: BiquadFilterType
    frequency: number
    q: number
    gain: number
  }
}
export interface SynthiaFileSynthNodePan extends SynthiaFileSynthNodeBase {
  type: SynthiaFileSynthNodeType.pan,
  properties: {
    pan: number;
  }
}
