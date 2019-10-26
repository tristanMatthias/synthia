// @ts-ignore
import { context, AudioNode, UserMedia } from 'tone';

import { Clock } from './Clock';
import { Defer } from './Defer';


export class Recorder {
  recording: Defer<Blob[]>;
  chunks: Blob[] = [];
  dest = context.createMediaStreamDestination();

  private _recorder = new MediaRecorder(this.dest.stream);
  private _isRecording = false;
  private _dataCallback?: (e: Blob[]) => void;

  constructor(input: AudioNode, cb?: (e: Blob[]) => void) {
    this._dataCallback = cb;
    this._recorder.addEventListener('dataavailable', this._handleData.bind(this) as EventListener);
    this._recorder.onstop = this._handleRecorderStop.bind(this);
    input.connect(this.dest);
  }

  record() {
    this.recording = new Defer<Blob[]>();
    this._recorder.start();
    this._isRecording = true;
    return this.recording.promise;
  }

  stop() {
    this._recorder.stop();
    Clock.stop();
  }

  private _handleData(e: BlobEvent) {
    this.chunks.push(e.data);
    if (this._dataCallback) this._dataCallback(this.chunks);
  }

  private _handleRecorderStop() {
    if (!this._isRecording) return this._flush();


    this.recording.resolve(this.chunks);

    this._isRecording = false;
    this._flush();
  }

  private _flush() {
    this.chunks = [];
  }
}
