import { v4 as uuid } from 'uuid';

import { EventObject } from '../EventObject/EventObject';
import { SynthiaFile, SynthiaFileSynthNode, SynthiaFileSynthNodeType } from '../File/file.type';
import { defaultSynthNodeProperties } from './defaultSynthNodeProperties';
import { wrapProxy } from './wrapProxy';


export enum ModelDataObjectType {
  meta = 'meta',
  synths = 'synths',
  synth = 'synth',
  synthNode = 'synthNode'
}


export interface ModelEvents {
  update: SynthiaFile
}

export class Model extends EventObject<ModelEvents> {
  // @ts-ignore Called from loadNewFile
  file: SynthiaFile;

  constructor(file: SynthiaFile) {
    super();
    this.loadNewFile(file);
  }

  loadNewFile(file: SynthiaFile) {
    this.file = wrapProxy(file, () => {
      this.emit('update', file);
    });
  }

  createSynthNode(synthId: string, x: number, y:number, type: SynthiaFileSynthNodeType, props?: any) {
    const properties = props || defaultSynthNodeProperties(type);
    const node: SynthiaFileSynthNode = {
      id: uuid(),
      type,
      properties,
      position: {x, y},
      receives: [],
      connectedTo: [],
    }
    const synth = this.file.resources.synths.find(s => s.id === synthId);
    if (!synth) throw new Error(`Could not find synth with id ${synthId}`);
    synth.nodes.push(node);

    return synth.nodes.slice(-1).pop();
  }
}
