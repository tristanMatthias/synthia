import 'core-js/features/math/scale';

import { EAudioTrack, EAudioTrackClip } from '@synthia/api/dist/gql/entities/AudioTrackEntity';
// @ts-ignore
import { UserMedia, Volume, Waveform, context } from 'tone';

import { EventObject } from '../EventObject/EventObject';
import { RecordController } from '../RecordController';
import { AudioClip } from './AudioClip';
import { AudioTrackClip } from './AudioTrackClip';
import { project } from '../Project/Project';
import { Recorder } from '../Recorder';
import shortid = require('shortid');
import { state } from '../../state/state';
import { Clock } from '../Clock';

export interface AudioTrackEvents {
  recordingAudio: { audioClip: AudioClip, audioTrackClip: AudioTrackClip }
}

export class AudioTrack extends EventObject<AudioTrackEvents> {
  audioTrackClips: AudioTrackClip[] = [];


  input = new Volume();
  media = new UserMedia();
  recorder = new Recorder(this.input, this._handleRecordingData.bind(this));

  private _activeAc: AudioClip | null = null;

  constructor(
    public audioTrack: EAudioTrack,
  ) {
    super();
    this.input.toMaster();
    this.media.connect(this.input);
  }

  async createAudioClip(start: number, duration?: number) {
    return project.createAudioTrackClip(this, start, duration);
  }


  async arm() {
    // @ts-ignore
    const inp = await this.media.open();
    RecordController.armAudioTrack(this);
  }

  disarm() {
    this.media.close();
    RecordController.disarmAudioTrack(this);
  }

  stopRecording() {
    this.recorder.stop();
  }

  recordAudioClip() {
    this.recorder.record();

    const ac = new AudioClip({
      id: shortid(),
      createdAt: new Date(),
      creatorId: state.user.data!.id,
      duration: 0,
      name: 'Recorded clip',
      public: true
    });

    this._activeAc = ac;

    const tco: EAudioTrackClip = {
      clipId: ac.audioClipObject.id,
      duration: 0,
      start: Clock.currentBeatExact
    };
    const atc = new AudioTrackClip(this, ac, tco);
    atc.recording = true;

    this.audioTrackClips.push(atc);

    const res = { audioClip: ac, audioTrackClip: atc };
    this.emit('recordingAudio', res);

    RecordController.once('stopRecording', () => {
      const i = this.audioTrackClips.findIndex(_atc => _atc === atc);
      this.audioTrackClips.splice(i, 1);
    });

    return res;
  }

  addAudioClip(ac: AudioClip, tc: EAudioTrackClip) {
    this.audioTrackClips.push(new AudioTrackClip(this, ac, tc));
  }

  // TODO: This should be an audio track clip, not an audio clip
  async removeAudioClip(ac: AudioClip) {
    console.log(ac);

    const toRemove = this.audioTrackClips.find(atc => atc.audioClip === ac);
    toRemove!.disconnect();
    this.audioTrackClips = this.audioTrackClips.filter(atc => atc.audioClip !== ac);
    this.audioTrack.audioClips = this.audioTrack.audioClips.filter(atc =>
      atc.clipId !== ac.audioClipObject.id
    );
  }

  private _handleRecordingData(b: Blob[]) {
    if (this._activeAc) this._activeAc.recordingBuffer = b;
  }
}
