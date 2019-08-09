export interface SynthiaProject extends SynthiaProjectMetadata {
  id: string;
  resources: SynthiaProjectResources
}

export interface SynthiaProjectResources {
  synths: SynthiaProjectResourceSynth[];
}


export interface SynthiaProjectMetadata {
  name: string;
  createdAt: Date;
  public: boolean;
  creatorId: string;
}


export interface SynthiaProjectResourceSynth extends SynthiaProjectMetadata {
  id: string;
  nodes: SynthiaProjectSynthNode[];
}

export enum SynthiaProjectSynthNodeType {
  oscillator = 'oscillator',
  wave = 'wave',
  reverb = 'reverb',
  delay = 'delay',
  filter = 'filter',
  pan = 'pan'
}


export interface SynthiaProjectSynthNodeBase {
  id: string;
  connectedTo: string[],
  receives: string[],
  position: {
    x: number
    y: number
  }
}

export type SynthiaProjectSynthNode =
  SynthiaProjectSynthNodeOscillator |
  SynthiaProjectSynthNodeWave |
  SynthiaProjectSynthNodeReverb |
  SynthiaProjectSynthNodeDelay |
  SynthiaProjectSynthNodeFilter |
  SynthiaProjectSynthNodePan

export interface SynthiaProjectSynthNodeOscillator extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.oscillator,
  properties: Partial<{}>
}
export interface SynthiaProjectSynthNodeWave extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.wave,
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
export interface SynthiaProjectSynthNodeReverb extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.reverb,
  properties: {
    roomSize: number;
    decayTime: number;
    fadeInTime: number;
    dryWet: number;
  }
}
export interface SynthiaProjectSynthNodeDelay extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.delay,
  properties: {
    delayTime: number;
    feedback: number;
    dryWet: number;
  }
}
export interface SynthiaProjectSynthNodeFilter extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.filter,
  properties: {
    type: BiquadFilterType
    frequency: number
    q: number
    gain: number
  }
}
export interface SynthiaProjectSynthNodePan extends SynthiaProjectSynthNodeBase {
  type: SynthiaProjectSynthNodeType.pan,
  properties: {
    pan: number;
  }
}
