import { SynthiaProject, SynthiaProjectSynthNode, SynthiaProjectSynthNodeType } from '@synthia/api';
import { v4 as uuid } from 'uuid';

import { EventObject } from '../EventObject/EventObject';
import { defaultSynthNodeProperties } from './defaultSynthNodeProperties';
import { wrapProxy } from './wrapProxy';

export enum ModelDataObjectType {
  meta = 'meta',
  synths = 'synths',
  synth = 'synth',
  synthNode = 'synthNode'
}


export interface ModelEvents {
  update: SynthiaProject
}

export class Model extends EventObject<ModelEvents> {
  // @ts-ignore Called from loadNewFile
  file: SynthiaProject;

  constructor(file: SynthiaProject) {
    super();
    this.loadNewFile(file);
  }

  loadNewFile(file: SynthiaProject) {
    this.file = wrapProxy(file, () => {
      this.emit('update', file);
    });
  }

  createSynthNode(synthId: string, x: number, y: number, type: SynthiaProjectSynthNodeType, props?: any) {
    const properties = props || defaultSynthNodeProperties(type);
    const node: SynthiaProjectSynthNode = {
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
