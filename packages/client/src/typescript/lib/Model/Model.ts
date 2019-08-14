import { EProject, ESynthNodeInput } from '@synthia/api';
import { SynthNodeType, TSynthiaProjectSynthNode } from '@synthia/api/dist/gql/entities/SynthNodeEntity';
import { v4 as uuid } from 'uuid';

import { API } from '../API/API';
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
  update: EProject
}

export const model = new class Model extends EventObject<ModelEvents> {
  file?: EProject;

  loadNewFile(file: EProject) {
    this.file = wrapProxy(file, () => {
      this.emit('update', file);
    });
  }

  createSynthNode(synthId: string, x: number, y: number, type: SynthNodeType, props?: any) {
    if (!this.file) throw new Error('Not initialized')
    const properties = props || defaultSynthNodeProperties(type);
    const node: TSynthiaProjectSynthNode = {
      id: uuid(),
      type,
      properties,
      position: {x, y},
      receives: [],
      connectedTo: [],
    }

    let synth = this.file.resources.synths.find(s => s.id === synthId);
    if (!synth) throw new Error(`Could not find synth with id ${synthId}`);
    synth.nodes.push(node);


    API.updateSynth({
      id: synth.id,
      nodes: synth.nodes as ESynthNodeInput[]
    });


    return node;
  }
}()
