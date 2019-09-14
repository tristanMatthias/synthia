// @ts-ignore
import { context } from 'tone';

import { Clock } from './Clock';
import { project } from './Project/Project';
import { EventObject } from './EventObject/EventObject';

export interface ExporterEvents {
  cancelled: void;
  started: void;
  finished: void;
}

export const Exporter = new class extends EventObject<ExporterEvents> {
  exporting = false;
  chunks: Blob[] = [];;
  dest = context.createMediaStreamDestination();
  duration: number | null = null;
  finished: boolean = false;

  private _recorder = new MediaRecorder(this.dest.stream);
  private _transportCb: number | null = null;

  constructor() {
    super();
    this.finish = this.finish.bind(this);
    this._recorder.addEventListener('dataavailable', this._handleData.bind(this) as EventListener);
    this._recorder.onstop = this._handleRecorderStop.bind(this);
  }

  export(time: number) {
    this.finished = false;
    this.duration = time;
    this._recorder.start();
    Clock.stop();
    Clock.play();
    this.exporting = true;

    this._transportCb = Clock.transport.scheduleOnce(this.finish, this.duration);
    this.emit('started', undefined);
  }

  cancel() {
    this.exporting = false;
    this._stop();
    if (this._transportCb) Clock.transport.clear(this._transportCb)
    this.emit('cancelled', undefined);
  }

  finish() {
    this.finished = true;
    this._stop();
    this.emit('finished', undefined);
  }

  private _handleData(e: BlobEvent) {
    this.chunks.push(e.data);
  }

  private _stop() {
    this._recorder.stop();
    Clock.stop();
  }

  private _handleRecorderStop() {
    if (!this.exporting) return this._flush();
    Clock.pause();
    const fr = new FileReader();
    // Make blob out of our blobs, and open it.
    const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
    fr.onload = () => {
      const a = document.createElement('a');
      a.href = fr.result as string;
      a.download = `${project.file!.name}.ogg`;
      a.target = '_blank';
      a.click();
    }
    fr.readAsDataURL(blob);

    this.exporting = false;
    this._flush();
  }

  private _flush() {
    this.chunks = [];
  }
}()
