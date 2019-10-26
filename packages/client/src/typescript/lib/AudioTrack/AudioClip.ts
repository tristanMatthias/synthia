import { blobToAudioBuffer } from '../blobConverter';
import { Player } from 'tone';
import { API_URL } from '../../config';
import { EventObject } from '../EventObject/EventObject';

// Copy of EAudioClip with optional URL
export interface AudioClipObject {
  id: string;
  duration: number;
  name: string;
  public: boolean;
  creatorId: string;
  createdAt: Date;
  url?: string;
}

export interface AudioClipEvents {
  loaded: Tone.Buffer;
}

export class AudioClip extends EventObject<AudioClipEvents> {
  recordingBuffer: Blob[];
  downloading: boolean = false;
  player: Player;
  buffer: Tone.Buffer

  constructor(
    public audioClipObject: AudioClipObject
  ) {
    super();
    this._download();
  }

  async saveBuffer() {
    const ab = await blobToAudioBuffer(this.recordingBuffer);
    this.player = new Player(ab);
  }

  private async _download() {
    if (!this.audioClipObject.url) return;
    this.downloading = true;
    this.player = new Player(`${API_URL}${this.audioClipObject.url}`, () => {
      this.downloading = false;
      this.buffer = this.player.buffer;
      this.emit('loaded', this.buffer);
    });
  }
}
