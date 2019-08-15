import { EProject, ESynthNodeInput } from '@synthia/api';
import { SynthNodeType, TSynthiaProjectSynthNode } from '@synthia/api/dist/gql/entities/SynthNodeEntity';
import { v4 as uuid } from 'uuid';

import { API } from '../API/API';
import { EventObject } from '../EventObject/EventObject';
import { defaultSynthNodeProperties } from './defaultSynthNodeProperties';
import { fileService } from '../File/FileService';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

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
  save: () => Promise<any> | false;

  constructor() {
    super();
    this.save = debounce(this._save, 500, {
      leading: true,
      trailing: true,
      maxWait: 1000
    });
  }

  loadNewFile(file: EProject) {
    this.file = proxa(file, () => {
      this.emit('update', file);
      this.save();
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

  private _save() {
    if (!this.file) return false;
    return fileService.save(this.file);
  }
}()
