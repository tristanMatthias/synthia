import { EAudioTrackClip } from '@synthia/api/dist/gql/entities/AudioTrackEntity';
import { proxa } from 'proxa';

import { beatsToTime } from '../beatsToTime';
import { AudioClip } from './AudioClip';
import { AudioTrack } from './AudioTrack';

export class AudioTrackClip {
  recording: boolean = false;
  private _connected = false;

  constructor(
    public audioTrack: AudioTrack,
    public audioClip: AudioClip,
    public audioTrackClip: EAudioTrackClip
  ) {
    proxa(this.audioClip.audioClipObject, this._update.bind(this));
    proxa(this.audioTrackClip, () => this._update());
    this._update();
  }

  private _update() {
    this.connect()
    if (!this.audioClip.player) return;
    this.audioClip.player.unsync().stop().sync()
      .start(beatsToTime(this.audioTrackClip.start))
      .stop(beatsToTime(this.audioTrackClip.start + this.audioTrackClip.duration))

  }

  connect() {
    if (this._connected) return;
    if (this.audioClip.player) {
      this.audioClip.player.connect(this.audioTrack.input);
      this._connected = true;
    }
  }
  disconnect() {
    if (!this._connected) return;
    if (this.audioClip.player) {
      this.audioClip.player.dispose();
      this._connected = false;
    }
  }
}
