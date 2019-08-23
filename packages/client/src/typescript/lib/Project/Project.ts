import { EProject } from '@synthia/api';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

import { EventObject } from '../EventObject/EventObject';
import { fileService } from '../File/FileService';
import { Instrument } from '../Instruments/Instrument';
import { Synth } from '../Instruments/Synth/Synth';

export enum ProjectDataObjectType {
  meta = 'meta',
  synths = 'synths',
  synth = 'synth',
  synthNode = 'synthNode'
}


export interface ProjectEvents {
  loadedNewProject: EProject;
}

export const project = new class Project extends EventObject<ProjectEvents> {
  file?: EProject;
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
      this.instruments[s.id] = new Synth(s);
    });

    this.emit('loadedNewProject', file);
  }

  private _save() {
    if (!this.file) return false;
    console.log(this.file.resources.synths);

    // Object.values(this.instruments).forEach
    return fileService.save(this.file);
  }
}()
