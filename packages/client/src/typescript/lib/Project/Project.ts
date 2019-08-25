import { EProject } from '@synthia/api';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

import { EventObject } from '../EventObject/EventObject';
import { fileService } from '../File/FileService';
import { Instrument } from '../Instruments/Instrument';
import { NodeSynth } from '../Instruments/Synth/NodeSynth';

export enum ProjectDataObjectType {
  meta = 'meta',
  synths = 'synths',
  synth = 'synth',
  synthNode = 'synthNode'
}


export interface ProjectEvents {
  loadedNewProject: EProject;
  close: void;
}

export const project = new class Project extends EventObject<ProjectEvents> {
  file: EProject | null = null;
  save: () => Promise<any> | false;
  instruments: {[id: string]: Instrument} = {};

  constructor() {
    super();
    this.save = debounce(this._save, 500, {
      leading: true,
      trailing: true,
      maxWait: 1000
    });
    fileService.on('loaded', this.loadNewFile.bind(this));
  }

  loadNewFile(file: EProject) {
    this.file = proxa(file, () => this.save());

    this.file.resources.synths.forEach(s => {
      this.instruments[s.id] = new NodeSynth(s);
    });

    this.emit('loadedNewProject', file);
  }

  close() {
    fileService.close();
    this.file = null;
    this.emit('close', undefined);
  }

  private _save() {
    if (!this.file) return false;
    // @ts-ignore
    (Object.values(this.instruments) as Synth[]).forEach(i => fileService.saveSynth(i.synth.toJSON()));
    return fileService.save(this.file);
  }
}()
