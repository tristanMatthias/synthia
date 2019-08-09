import { EventObject } from '../EventObject/EventObject';
import { defaultProject } from './defaultProject';
import { SynthiaProject } from '@synthia/api';

interface FileServiceEvents {
  loaded: SynthiaProject;
}

export class FileService extends EventObject<FileServiceEvents> {


  private _fileReader = new FileReader();

  private _file: SynthiaProject;
  public get file(): SynthiaProject {
    return this._file;
  }
  public set file(v: SynthiaProject) {
    this._file = v;

    if (v) this.emit('loaded', v);
  }


  constructor(){
    super();
    this._fileReader.addEventListener('load', file => {
      // @ts-ignore
      this.file = JSON.parse(file.target.result);
    });
  }


  async fromJSON(json: string | SynthiaProject) {
    if (typeof json === 'string') this.file = JSON.parse(json);
    this.file = json as SynthiaProject;
  }

  async loadDefault() {
    this.file = defaultProject;
  }

  async load(url: string) {
    this.file = await fetch(url).then(r => r.json());
  }


  async openFile() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.addEventListener('change', (e) => {
      // @ts-ignore
      const f = e.target.files[0];

      // Read in the image file as a data URL.
      this._fileReader.readAsText(f);
    });

    inp.click();
    inp.remove();
  }


  async download() {
    if (!this._file) return false;

    const a = document.createElement('a');
    a.download = `${this._file.name}.synth`;
    const data = new Blob([JSON.stringify(this._file)], { type: 'text/plain' });

    a.href = window.URL.createObjectURL(data);
    a.click();
    a.remove();

    return true;
  }
}
