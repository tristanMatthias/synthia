import { EProject } from '@synthia/api';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

import { EventObject } from '../EventObject/EventObject';
import { fileService } from '../File/FileService';
import { Instrument } from '../Instruments/Instrument';
import { NodeSynth } from '../Instruments/Synth/NodeSynth';
import { MidiClip } from '../MidiTrack/MidiClip';
import { MidiTrack } from '../MidiTrack/MIDITrack';
import { EMidiClip } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { API } from '../API/API';
import { EMidiTrack, EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { MidiTrackClip } from '../MidiTrack/MidiTrackClip';

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

  instruments: { [id: string]: Instrument } = {};
  midiClips: { [id: string]: MidiClip } = {};
  midiTracks: { [id: string]: MidiTrack } = {}

  constructor() {
    super();
    this.save = debounce(this._save, 500, {
      leading: true,
      trailing: true,
      maxWait: 1000
    });
    fileService.on('loaded', this.loadNewFile.bind(this));
  }

  async loadNewFile(file: EProject) {
    this.file = proxa(file, () => this.save());

    this.file.resources.synths.forEach(s => {
      this.instruments[s.id] = new NodeSynth(s);
    });

    // Register saving for all changes to midi clip
    this.file.resources.midiClips.forEach(this.registerMidiClip.bind(this));
    this.file.midiTracks.forEach(this.registerMidiTrack.bind(this));

    this.emit('loadedNewProject', file);
  }


  registerMidiTrack(mtc: EMidiTrack) {
    let i
    if (mtc.instrumentId) i = this.instruments[mtc.instrumentId];

    // Register saving for all changes to midi track
    proxa(mtc, this._saveMidiTrack);

    const mt = new MidiTrack(mtc, i);
    mtc.midiClips.forEach(c => {
      mt.addMidiClip(this.midiClips[c.clipId], c);
    });
    this.midiTracks[mtc.id] = mt;
  }

  registerMidiClip(mcObj: EMidiClip) {
    return this.midiClips[mcObj.id] = new MidiClip(
      proxa(mcObj, this._saveMidiClip)
    );
  }

  async registerMidiTrackClip(
    mt: MidiTrack,
    start: number,
    duration?: number,
    mc?: MidiClip,
  ) {
    let midiClip = mc;

    if (!midiClip) {
      const mcO = await API.createMidiClip(project.file!.id);
      midiClip = project.registerMidiClip(mcO);
    }

    const trackClipObject: EMidiTrackClip = proxa({
      clipId: midiClip.midiClipObject.id,
      start,
      duration: duration || midiClip.midiClipObject.duration
    }, () => this._saveMidiTrack(mt.midiTrack));

    const mtc = new MidiTrackClip(mt, midiClip, trackClipObject);
    mt.midiTrackClips.push(mtc);
    mt.midiTrack.midiClips.push(trackClipObject);
    return mtc;
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

  private _saveMidiClip(mc: EMidiClip) {
    // @ts-ignore
    const {creatorId, createdAt, ..._mc} = mc.toJSON();
    API.updateMidiClip(_mc);
  }

  private _saveMidiTrack(mt: EMidiTrack) {
    // @ts-ignore
    API.updateMidiTrack(mt.toJSON())
  }
}()
