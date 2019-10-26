import { EProject } from '@synthia/api';
import { EAudioTrack, EAudioTrackClip } from '@synthia/api/dist/gql/entities/AudioTrackEntity';
import { EMidiClip } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { EMidiTrack, EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import debounce from 'lodash.debounce';
import { proxa } from 'proxa';

import { API } from '../API/API';
import { AudioClip } from '../AudioTrack/AudioClip';
import { AudioTrack } from '../AudioTrack/AudioTrack';
import { EventObject } from '../EventObject/EventObject';
import { fileService } from '../File/FileService';
import { Instrument } from '../Instruments/Instrument';
import { NodeSynth } from '../Instruments/Synth/NodeSynth';
import { MidiClip } from '../MidiTrack/MidiClip';
import { MidiTrack } from '../MidiTrack/MIDITrack';
import { MidiTrackClip } from '../MidiTrack/MidiTrackClip';
import { EAudioClip } from '@synthia/api/dist/gql/entities/AudioClipEntity';
import { AudioTrackClip } from '../AudioTrack/AudioTrackClip';

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

  audioClips: { [id: string]: AudioClip } = {};
  audioTracks: { [id: string]: AudioTrack } = {}

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
    this.file.resources.audioClips.forEach(this.registerAudioClip.bind(this));
    this.file.midiTracks.forEach(this.registerMidiTrack.bind(this));
    this.file.audioTracks.forEach(this.registerAudioTrack.bind(this));

    this.emit('loadedNewProject', file);
  }


  registerAudioTrack(atc: EAudioTrack) {

    // Register saving for all changes to midi track
    proxa(atc, this._saveAudioTrack);

    const at = new AudioTrack(atc);
    atc.audioClips.forEach(c => {
      if (!this.audioClips[c.clipId]) throw new Error(`Could not find audio clip ${c.clipId} for audio track ${at.audioTrack.id}`)
      at.addAudioClip(this.audioClips[c.clipId], c);
    });
    this.audioTracks[atc.id] = at;
  }


  registerAudioClip(acObj: EAudioClip) {
    return this.audioClips[acObj.id] = new AudioClip(
      proxa(acObj, this._saveAudioClip)
    );
  }


  async createAudioTrackClip(
    at: AudioTrack,
    start: number,
    duration?: number,
    ac?: AudioClip,
  ) {
    let audioClip = ac;

    if (!audioClip) {
      // @ts-ignore
      // TODO: File upload
      const mcO = await API.createAudioClip({ projectId: project.file!.id, file: null });
      audioClip = project.registerAudioClip(mcO);
    }

    const trackClipObject: EAudioTrackClip = proxa({
      clipId: audioClip.audioClipObject.id,
      start,
      duration: duration || audioClip.audioClipObject.duration
    }, () => this._saveAudioTrack(at.audioTrack));

    const mtc = new AudioTrackClip(at, audioClip, trackClipObject);
    at.audioTrackClips.push(mtc);
    at.audioTrack.audioClips.push(trackClipObject);
    return mtc;
  }

  async saveRecordedAudioTrackClip(
    at: AudioTrack,
    start: number,
    ac: AudioClip,
    file: File | Blob
  ) {
    const { duration, name } = ac.audioClipObject;
    const mcO = await API.createAudioClip({
      projectId: project.file!.id,
      duration,
      name,
      // @ts-ignore
      file
    });

    const mcRegistered = this.registerAudioClip(mcO);
    return this.registerAudioTrackClip(at, start, mcRegistered, duration);
  }

  async registerAudioTrackClip(
    at: AudioTrack,
    start: number,
    ac: AudioClip,
    duration?: number,
  ) {
    let audioClip = ac;

    // if (!audioClip) {
    //   const mcO = await API.createAudioClip({ projectId: project.file!.id });
    //   audioClip = project.registerAudioClip(mcO);
    // }

    const trackClipObject: EAudioTrackClip = proxa({
      clipId: audioClip.audioClipObject.id,
      start,
      duration: duration || audioClip.audioClipObject.duration
    }, () => this._saveAudioTrack(at.audioTrack));

    const mtc = new AudioTrackClip(at, audioClip, trackClipObject);
    at.audioTrackClips.push(mtc);
    at.audioTrack.audioClips.push(trackClipObject);
    return mtc;
  }



  registerMidiTrack(mtc: EMidiTrack) {
    let i
    if (mtc.instrumentId) i = this.instruments[mtc.instrumentId];

    // Register saving for all changes to midi track
    proxa(mtc, this._saveMidiTrack);

    const mt = new MidiTrack(mtc, i);
    mtc.midiClips.forEach(c => {
      if (!this.midiClips[c.clipId]) throw new Error(`Could not find midi clip ${c.clipId} for midi track ${mt.midiTrack.id}`)
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
      const mcO = await API.createMidiClip({ projectId: project.file!.id });
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

  async saveRecordedMidiTrackClip(
    mt: MidiTrack,
    start: number,
    mc: MidiClip,
  ) {
    const { duration, notes, name } = mc.midiClipObject;
    const mcO = await API.createMidiClip({
      projectId: project.file!.id,
      duration,
      notes,
      name
    });

    const mcRegistered = this.registerMidiClip(mcO);
    return this.registerMidiTrackClip(mt, start, duration, mcRegistered);
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
    const { creatorId, createdAt, ..._mc } = mc.toJSON();
    API.updateMidiClip(_mc);
  }

  private _saveMidiTrack(mt: EMidiTrack) {
    // @ts-ignore
    API.updateMidiTrack(mt.toJSON())
  }

  private _saveAudioClip(_ac: EAudioClip) {
    // // @ts-ignore
    // const { creatorId, createdAt, ..._mc } = ac.toJSON();
    // API.updateAudioClip(_mc);
  }
  private _saveAudioTrack(at: EAudioTrack) {
    console.log(at);

    // @ts-ignore
    API.updateAudioTrack(at.toJSON())
  }
}()
