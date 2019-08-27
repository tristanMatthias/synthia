import { EProject } from '@synthia/api';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

import { EventObject } from '../EventObject/EventObject';
import { fileService } from '../File/FileService';
import { Instrument } from '../Instruments/Instrument';
import { NodeSynth } from '../Instruments/Synth/NodeSynth';
import { MidiTrack } from '../MidiTrack/MIDITrack';
import { MidiClip } from '../MidiTrack/MidiClip';

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
  midiClips: {[id: string]: MidiClip} = {};
  midiTracks: {[id: string]: MidiTrack} = {}

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

    this.file.resources.midiClips.forEach(c => {
      this.midiClips[c.id] = new MidiClip(c);
    });

    this.file.midiTracks.forEach(t => {
      let i
      if (t.instrumentId) i = this.instruments[t.instrumentId];

      const mt = new MidiTrack(t, i);
      t.midiClips.forEach(c => {
        mt.createMidiClip(c.start, this.midiClips[c.clipId]);
      });
      this.midiTracks[t.id] = mt;
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
    (Object.values(this.instruments) as Synth[]).forEach(i => fileService.saveSynth(i.instrumentObject.toJSON()));
    return fileService.save(this.file);
  }
}()
